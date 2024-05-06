import React from 'react';
import Header from '../Header/Header';
import Container from '../Container/Container';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <Box>
    <Header />
    <Box sx={{ pt: 2, pb: 2 }}>
      <Container>{children}</Container>
    </Box>
  </Box>
);

export default Layout;
