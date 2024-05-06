// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch';

import '@testing-library/jest-dom';

jest.mock('./app/constants', () => ({
  API_HOST: 'http://localhost:3000',
}));
