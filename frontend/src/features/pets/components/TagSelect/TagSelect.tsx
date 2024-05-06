import React, { SyntheticEvent } from 'react';
import { Tag } from '../../api/api.ts';
import { Autocomplete, TextField } from '@mui/material';

interface TagSelectProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
}

const TagSelect: React.FC<TagSelectProps> = ({
  value,
  onChange,
  placeholder = 'Add a new tag...',
}) => {
  const handleOnChange = (_: SyntheticEvent, tags: (string | Tag)[]) => {
    const uniqueTags = new Set<string>();
    tags.forEach((t) => {
      if (typeof t === 'string') {
        uniqueTags.add(t);
        return;
      }
      if (t.name) {
        uniqueTags.add(t.name);
      }
    });
    const newTags = Array.from(uniqueTags).map((t) => ({ name: t }));
    onChange(newTags);
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      id="tags-standard"
      freeSolo
      filterSelectedOptions
      options={[]}
      onChange={handleOnChange}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.name) {
          return option.name;
        }
        return '';
      }}
      value={value}
      renderInput={(params) => (
        <TextField placeholder={placeholder} {...params} />
      )}
    />
  );
};

export default TagSelect;
