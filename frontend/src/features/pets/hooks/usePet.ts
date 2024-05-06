import useAPIClient from './useAPIClient.ts';
import { useEffect, useState } from 'react';
import { Pet } from '../api/api.ts';
import ensureError from '../../../app/helpers/ensureError.ts';

const usePet = (id: number) => {
  const { client } = useAPIClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      try {
        const { data: pet } = await client.pet.getPetById(id);
        setPet(pet);
        setError(null);
      } catch (e) {
        const error = ensureError(e);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();

    return () => {};
  }, [id, client]);

  const update = async (draft: Pet) => {
    setIsUpdatePending(true);
    let pet: Pet | null = null;
    try {
      const result = await client.pet.updatePet(draft);
      pet = result.data;
      setPet(pet);
      setError(null);
      return pet;
    } catch (e) {
      const error = ensureError(e);
      setError(error);
    } finally {
      setIsUpdatePending(false);
    }
  };

  return {
    pet,
    isLoading,
    isUpdatePending,
    error,
    update,
  };
};

export default usePet;
