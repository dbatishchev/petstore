import React from 'react';
import { Link } from 'react-router-dom';
import { Pet } from '../../../api/api.ts';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import PetImage from './PetImage/PetImage.tsx';
import ActionMenu from './ActionMenu/ActionMenu.tsx';

interface PetListCardProps {
  pet: Pet;
  onDelete: (pet: Pet) => void;
}

const PetListCard: React.FC<PetListCardProps> = ({ pet, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <PetImage pet={pet} />
      <CardContent>
        <Typography variant="h5" component="div">
          {pet.name}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button size="small" component={Link} to={`pet/${pet.id}`}>
          Learn More
        </Button>
        <Box sx={{ ml: 'auto' }}>
          <ActionMenu pet={pet} onDelete={onDelete} />
        </Box>
      </CardActions>
    </Card>
  );
};

export default PetListCard;
