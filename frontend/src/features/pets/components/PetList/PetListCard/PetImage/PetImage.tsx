import React from 'react';
import { CardMedia } from '@mui/material';
import { Pet } from '../../../../api/api.ts';

interface PetImageProps {
  pet: Pet;
}

const PetImage: React.FC<PetImageProps> = ({ pet }) => {
  const img =
    pet.photoUrls.length > 0
      ? pet.photoUrls[0]
      : 'http://placekitten.com/300/300';

  return <CardMedia sx={{ height: 160 }} image={img} title={pet.name} />;
};

export default PetImage;
