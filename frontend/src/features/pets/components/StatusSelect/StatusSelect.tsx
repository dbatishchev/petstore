import React from 'react';
import { PetStatusEnum } from '../../api/api.ts';
import { Select, SelectChangeEvent } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

interface StatusSelectProps {
  value?: PetStatusEnum | null;
  onChange: (status: PetStatusEnum | null) => void;
  label?: string;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  label,
}) => {
  const val = value || '';

  const handleOnChange = (event: SelectChangeEvent<{ value: string }>) => {
    const value = event.target.value
      ? (event.target.value as PetStatusEnum)
      : null;
    onChange(value);
  };

  return (
    <Select
      label={label}
      onChange={handleOnChange}
      fullWidth
      value={
        val as unknown as { value: string } // there is a bug in the types of MUI Select; this is a workaround
      }
      inputProps={{
        id: 'status',
      }}
    >
      <MenuItem value="">
        <em>none</em>
      </MenuItem>
      <MenuItem value={PetStatusEnum.Available}>
        {PetStatusEnum.Available}
      </MenuItem>
      <MenuItem value={PetStatusEnum.Sold}>{PetStatusEnum.Sold}</MenuItem>
      <MenuItem value={PetStatusEnum.Pending}>{PetStatusEnum.Pending}</MenuItem>
    </Select>
  );
};

export default StatusSelect;
