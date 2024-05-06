import useAPIClient from './useAPIClient.ts';
import { useState } from 'react';
import { Pet, PetStatusEnum } from '../api/api.ts';
import ensureError from '../../../app/helpers/ensureError.ts';

const usePetCreate = () => {
  const { client } = useAPIClient();
  const [pet, setPet] = useState<Pet>({
    name: '',
    category: { name: '' },
    photoUrls: [],
    tags: [],
    status: PetStatusEnum.Available,
  });
  const [isCreatePending, setIsCreatePending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = async (draft: Pet) => {
    setIsCreatePending(true);
    let pet: Pet | null = null;
    try {
      const result = await client.pet.addPet(draft);
      pet = result.data;
      setPet(pet);
      setError(null);
      return pet;
    } catch (e) {
      const error = ensureError(e);
      setError(error);
    } finally {
      setIsCreatePending(false);
    }
  };

  return {
    pet,
    isCreatePending,
    error,
    save,
  };
};

export default usePetCreate;
