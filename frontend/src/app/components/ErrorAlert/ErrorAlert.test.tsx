import { render } from '@testing-library/react';
import ErrorAlert from './ErrorAlert';
describe('ErrorAlert', () => {
  it('renders with correct error message', () => {
    const errorMessage = 'Test error message';
    const { getByText } = render(<ErrorAlert message={errorMessage} />);
    expect(getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });
});
