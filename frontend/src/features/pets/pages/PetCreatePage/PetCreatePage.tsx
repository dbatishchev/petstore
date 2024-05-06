import React from 'react';
import { Pet } from '../../api/api.ts';
import PetEditForm from '../../components/PetEditForm/PetEditForm.tsx';
import { useNavigate } from 'react-router-dom';
import usePetCreate from '../../hooks/usePetCreate.ts';

const PetCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { pet, save, isCreatePending } = usePetCreate();

  const handleFormSubmit = async (pet: Pet) => {
    const savedPet = await save(pet);
    if (!savedPet) {
      return;
    }
    navigate(`/pet/${savedPet.id}`);
  };

  return (
    <PetEditForm
      pet={pet}
      onSubmit={handleFormSubmit}
      isLoading={isCreatePending}
    />
  );
};

export default PetCreatePage;
