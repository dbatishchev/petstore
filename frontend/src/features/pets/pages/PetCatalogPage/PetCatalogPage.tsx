import React from 'react';
import PetList from '../../components/PetList/PetList';
import { Pet } from '../../api/api.ts';
import { Box } from '@mui/material';
import PetToolbar from '../../components/PetToolbar/PetToolbar.tsx';
import usePetList from '../../hooks/usePetList.ts';
import Loading from '../../../../app/components/Loading/Loading.tsx';

const PetCatalogPage: React.FC = () => {
  const {
    isLoading,
    error,
    items,
    status,
    tags,
    onStatusChange,
    onTagsChange,
    remove,
  } = usePetList();

  const handleDelete = async (pet: Pet) => {
    if (!pet.id) {
      return;
    }
    await remove(pet.id);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <PetToolbar
          status={status}
          tags={tags}
          onStatusChange={onStatusChange}
          onTagsChange={onTagsChange}
        />
      </Box>
      {isLoading && <Loading />}
      {!isLoading && !error && items.length === 0 && <div>No pets found</div>}
      {error && <div>Error: {error.message}</div>}
      {!isLoading && !error && items.length > 0 && (
        <PetList items={items} onDelete={handleDelete} />
      )}
    </Box>
  );
};

export default PetCatalogPage;
