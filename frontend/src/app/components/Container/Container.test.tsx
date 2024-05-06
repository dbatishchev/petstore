import { render } from '@testing-library/react';
import Container from './Container';

describe('Container', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Container>
        <div>Hello World!</div>
      </Container>,
    );
    expect(getByText('Hello World!')).toBeInTheDocument();
  });
});
