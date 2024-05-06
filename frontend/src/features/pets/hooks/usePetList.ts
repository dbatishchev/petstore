import { useEffect, useState } from 'react';
import {
  FindPetsByStatusParamsStatusEnum,
  Pet,
  PetStatusEnum,
  Tag,
} from '../api/api.ts';
import ensureError from '../../../app/helpers/ensureError.ts';
import useAPIClient from './useAPIClient.ts';

const usePetList = () => {
  const { client } = useAPIClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<Pet[]>([]);
  const [status, setStatus] = useState<PetStatusEnum | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    loadPets();
  }, [tags, status]);

  const loadPets = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    let items;

    try {
      if (status) {
        const result = await client.pet.findPetsByStatus({
          status: status as unknown as FindPetsByStatusParamsStatusEnum, // FindPetsByStatusParamsStatusEnum and PetStatusEnum are identical; ideally, we should use define and use the same enum in OpenAPI; this type casting is a workaround
        });
        items = result.data;
      } else {
        const filteredTags = tags
          .map((t) => t.name)
          .filter((t): t is string => !!t);
        const result = await client.pet.findPetsByTags({
          tags: filteredTags,
        });
        items = result.data;
      }
      setItems(items);
    } catch (e) {
      const error = ensureError(e);
      setError(error);
      setItems([]);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: number) => {
    setIsLoading(true);
    try {
      await client.pet.deletePet(id);
      await loadPets();
    } catch (e) {
      const error = ensureError(e);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status: PetStatusEnum | null) => {
    setStatus(status);
    setTags([]);
  };

  const handleTagsChange = (tags: Tag[]) => {
    setTags(tags);
    setStatus(null);
  };

  return {
    isLoading,
    error,
    items,
    status,
    tags,
    setStatus,
    setTags,
    remove,
    onStatusChange: handleStatusChange,
    onTagsChange: handleTagsChange,
  };
};

export default usePetList;
