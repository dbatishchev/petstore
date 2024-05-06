import React, { useState } from 'react';
import { Pet, PetStatusEnum, Tag } from '../../api/api.ts';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  TextField,
} from '@mui/material';
import StatusSelect from '../StatusSelect/StatusSelect.tsx';
import TagSelect from '../TagSelect/TagSelect.tsx';

type PetEditFormProps = {
  pet: Pet;
  onSubmit: (pet: Pet) => Promise<void>;
  isLoading: boolean;
};

const PetEditForm: React.FC<PetEditFormProps> = ({
  pet,
  onSubmit,
  isLoading,
}) => {
  const [petDraft, setPetDraft] = useState<Pet>(() => {
    const category = { name: pet.category ? pet.category.name : '' };
    const tags = pet.tags
      ? pet.tags.map((t) => ({
          name: t.name,
        }))
      : [];

    return {
      id: pet.id,
      name: pet.name,
      category: category,
      status: pet.status,
      tags: tags,
      photoUrls: pet.photoUrls,
    };
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!petDraft.name) {
      return;
    }

    if (!petDraft.category || !petDraft.category.name) {
      return;
    }

    const request = {
      ...petDraft,
    };
    onSubmit(request);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPetDraft({ ...petDraft, name: event.target.value });
  };

  const handleStatusChange = (status: PetStatusEnum | null) => {
    if (status === null) {
      return;
    }
    setPetDraft({ ...petDraft, status });
  };

  const handleTagChange = (tags: Tag[]) => {
    setPetDraft({
      ...petDraft,
      tags: tags,
    });
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPetDraft({
      ...petDraft,
      category: { name: event.target.value },
    });
  };

  return (
    <Box>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }} htmlFor="name">
                Name
              </FormLabel>
              <TextField
                value={petDraft.name}
                onChange={handleNameChange}
                id="name"
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }} htmlFor="category">
                Category
              </FormLabel>
              <TextField
                value={petDraft.category?.name}
                onChange={handleCategoryChange}
                id="category"
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Status</FormLabel>
              <StatusSelect
                value={petDraft.status}
                onChange={handleStatusChange}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>Tags</FormLabel>
              <TagSelect
                value={petDraft.tags || []}
                onChange={handleTagChange}
              />
            </FormControl>
          </Grid>
          <Grid item sx={{ display: 'flex' }}>
            <Button type="submit" sx={{ ml: 'auto' }} disabled={isLoading}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PetEditForm;
