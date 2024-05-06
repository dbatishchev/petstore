import { PetStatusEnum } from '../../api/openapi/types';

export type CategoryDTO = {
  id?: number;
  name?: string;
};

export type TagDTO = {
  id?: number;
  name?: string;
};

export type PetDTO = {
  id?: number;
  name: string;
  category?: CategoryDTO;
  photoUrls: string[];
  tags?: TagDTO[];
  status?: PetStatusEnum;
};
