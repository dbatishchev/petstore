import React from 'react';
import Container from '../Container/Container';
import { AppBar, Toolbar, Typography } from '@mui/material';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => (
  <AppBar position="static">
    <Container>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pet Store
        </Typography>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Header;
