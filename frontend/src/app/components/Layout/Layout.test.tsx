import { render } from '@testing-library/react';
import Layout from './Layout';

describe('Layout', () => {
  it('renders without crashing', () => {
    render(<Layout>Hello World!</Layout>);
  });

  it('renders children within Container', () => {
    const { getByText } = render(<Layout>Child Component</Layout>);
    expect(getByText('Child Component')).toBeInTheDocument();
  });
});
