import React from 'react';
import { Pet } from '../../api/api.ts';
import { Box, CardMedia, Chip, Stack, Typography } from '@mui/material';

interface PetDetailsProps {
  pet: Pet;
  className?: string;
}

const PetDetails: React.FC<PetDetailsProps> = ({ pet }) => {
  const img =
    pet.photoUrls.length > 0
      ? pet.photoUrls[0]
      : 'https://placehold.co/600x600';

  return (
    <Box>
      <CardMedia sx={{ height: 320 }} image={img} title={pet.name} />

      <Typography variant="h3" component="div" sx={{ mt: 1, mb: 2 }}>
        {pet.name}
      </Typography>

      {pet.category && (
        <Typography variant="body1" component="div" sx={{ mb: 2 }}>
          {pet.category.name}
        </Typography>
      )}

      <Chip label={pet.status}></Chip>

      {pet.tags && pet.tags.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {pet.tags.map((tag) => (
            <Chip key={tag.id} label={tag.name} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default PetDetails;
