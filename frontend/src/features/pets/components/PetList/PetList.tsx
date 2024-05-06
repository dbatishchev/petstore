import React from 'react';
import PetListCard from './PetListCard/PetListCard';
import { Pet } from '../../api/api.ts';
import { Grid } from '@mui/material';

interface PetListProps {
  items: Pet[];
  onDelete: (pet: Pet) => void;
}

const PetList: React.FC<PetListProps> = ({ items, onDelete }) => (
  <Grid container spacing={2}>
    {items.map((item) => (
      <Grid item xs={4} key={item.id}>
        <PetListCard pet={item} onDelete={onDelete} />
      </Grid>
    ))}
  </Grid>
);

export default PetList;
