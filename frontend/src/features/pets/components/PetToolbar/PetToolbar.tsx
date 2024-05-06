import React from 'react';
import { Box, Button, FormControl, Grid, InputLabel } from '@mui/material';
import { PetStatusEnum, Tag } from '../../api/api.ts';
import StatusSelect from '../StatusSelect/StatusSelect.tsx';
import TagSelect from '../TagSelect/TagSelect.tsx';
import { Link } from 'react-router-dom';

type PetFiltersProps = {
  status: PetStatusEnum | null;
  tags: Tag[];
  onStatusChange: (status: PetStatusEnum | null) => void;
  onTagsChange: (tags: Tag[]) => void;
};

const PetToolbar: React.FC<PetFiltersProps> = ({
  status,
  tags,
  onStatusChange,
  onTagsChange,
}) => {
  return (
    <Box>
      <Grid container direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Grid item xs={5}>
          <FormControl fullWidth>
            <InputLabel htmlFor={'status'}>Status</InputLabel>
            <StatusSelect
              value={status}
              onChange={onStatusChange}
              label={'Status'}
            />
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <FormControl fullWidth>
            <TagSelect
              value={tags}
              onChange={onTagsChange}
              placeholder="Tags"
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Button size="small" component={Link} to={`pet/create`}>
            Create Pet
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PetToolbar;
