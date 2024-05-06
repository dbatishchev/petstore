import React from 'react';
import { useParams } from 'react-router-dom';
import PetDetails from '../../components/PetDetails/PetDetails.tsx';
import usePet from '../../hooks/usePet.ts';
import Loading from '../../../../app/components/Loading/Loading.tsx';
import ErrorAlert from '../../../../app/components/ErrorAlert/ErrorAlert.tsx';

const PetDetailPage: React.FC = () => {
  const { id } = useParams();
  const { pet, isLoading, error } = usePet(Number(id));

  if (!pet && isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert message={error.message} />;
  }

  if (!pet) {
    return null;
  }

  return <PetDetails pet={pet} />;
};

export default PetDetailPage;
