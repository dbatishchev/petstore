import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet } from '../../api/api.ts';
import PetEditForm from '../../components/PetEditForm/PetEditForm.tsx';
import usePet from '../../hooks/usePet.ts';
import Loading from '../../../../app/components/Loading/Loading.tsx';
import ErrorAlert from '../../../../app/components/ErrorAlert/ErrorAlert.tsx';

const PetEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pet, isLoading, isUpdatePending, update, error } = usePet(Number(id));

  const handleFormSubmit = async (pet: Pet) => {
    const updatedPet = await update(pet);
    if (!updatedPet) {
      return;
    }
    navigate(`/pet/${updatedPet.id}`);
  };

  if (!pet && isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert message={error.message} />;
  }

  if (!pet) {
    return null;
  }

  return (
    <PetEditForm
      pet={pet}
      onSubmit={handleFormSubmit}
      isLoading={isUpdatePending}
    />
  );
};

export default PetEditPage;
