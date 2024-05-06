import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { generatePet } from '../../../../../test/generatePet.ts';
import { PetStatusEnum } from '../../api/api.ts';
import PetDetailPage from './PetDetailPage.tsx';

describe(PetDetailPage.name, () => {
  const server = setupServer(
    rest.get('http://localhost:3000/pet/1', (_, res, ctx) =>
      res(
        ctx.json(
          generatePet({
            id: 1,
            name: 'Pet 1',
            status: PetStatusEnum.Available,
          }),
        ),
      ),
    ),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should render loader first', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1']}>
        <Routes>
          <Route path="/pet/:id" element={<PetDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should render pet name', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1']}>
        <Routes>
          <Route path="/pet/:id" element={<PetDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Pet 1/i)).toBeInTheDocument();
  });

  it('should render error', async () => {
    server.use(
      rest.get('http://localhost:3000/pet/1', (_, res, ctx) =>
        res(ctx.status(500)),
      ),
    );

    render(
      <MemoryRouter initialEntries={['/pet/1']}>
        <Routes>
          <Route path="/pet/:id" element={<PetDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Error/i)).toBeInTheDocument();
  });

  it('should render pet image', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1']}>
        <Routes>
          <Route path="/pet/:id" element={<PetDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('img')).toBeInTheDocument();
  });

  it('should render pet status', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1']}>
        <Routes>
          <Route path="/pet/:id" element={<PetDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Available/i)).toBeInTheDocument();
  });

  it('should render pet category', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1']}>
        <Routes>
          <Route path="/pet/:id" element={<PetDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Test Category/i)).toBeInTheDocument();
  });

  it('should render pet tags', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1']}>
        <Routes>
          <Route path="/pet/:id" element={<PetDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/test-tag-1/i)).toBeInTheDocument();
    expect(await screen.findByText(/test-tag-2/i)).toBeInTheDocument();
  });
});
