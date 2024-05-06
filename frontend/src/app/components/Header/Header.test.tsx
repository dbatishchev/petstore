import { render } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
  });

  it('renders the title correctly', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Pet Store')).toBeInTheDocument();
  });
});
