import React from 'react';
import { Box } from '@mui/material';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => (
  <Box sx={{ pl: 2, pr: 2, maxWidth: 720, margin: '0 auto' }}>{children}</Box>
);

export default Container;
