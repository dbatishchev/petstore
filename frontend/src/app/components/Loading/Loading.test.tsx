import { render } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
  it('renders without crashing', () => {
    render(<Loading />);
  });

  it('renders the title correctly', () => {
    const { getByText } = render(<Loading />);
    expect(getByText(/Loading/i)).toBeInTheDocument();
  });
});
