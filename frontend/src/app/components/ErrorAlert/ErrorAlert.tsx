import React from 'react';
import { Alert } from '@mui/material';

type ErrorAlertProps = {
  message: string;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <Alert severity="error">Error: {message}</Alert>
);

export default ErrorAlert;
