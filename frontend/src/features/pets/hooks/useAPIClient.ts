import { Api } from '../api/api.ts';
import { useRef } from 'react';
import { API_HOST } from '../../../app/constants.ts';

const useAPIClient = () => {
  const client = useRef(new Api({ baseUrl: API_HOST }));

  return {
    client: client.current,
  };
};

export default useAPIClient;
