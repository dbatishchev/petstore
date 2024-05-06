import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { generatePet } from '../../../../../test/generatePet.ts';
import { PetStatusEnum } from '../../api/api.ts';
import * as router from 'react-router';
import PetEditPage from './PetEditPage.tsx';

describe(PetEditPage.name, () => {
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
    rest.put('http://localhost:3000/pet', (_, res, ctx) =>
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

  const navigate = jest.fn();

  beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loader first', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1/edit']}>
        <Routes>
          <Route path="/pet/:id/edit" element={<PetEditPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should render create form', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1/edit']}>
        <Routes>
          <Route path="/pet/:id/edit" element={<PetEditPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Name/i)).toBeInTheDocument();
    expect(await screen.findByText(/Status/i)).toBeInTheDocument();
    expect(await screen.findByText(/Category/i)).toBeInTheDocument();
  });

  it('should populate form with pet data', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1/edit']}>
        <Routes>
          <Route path="/pet/:id/edit" element={<PetEditPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByDisplayValue(/Pet 1/i)).toBeInTheDocument();
    expect(await screen.findByDisplayValue(/Available/i)).toBeInTheDocument();
  });

  it('should render error', async () => {
    server.use(
      rest.get('http://localhost:3000/pet/1', (_, res, ctx) =>
        res(ctx.status(500)),
      ),
    );

    render(
      <MemoryRouter initialEntries={['/pet/1/edit']}>
        <Routes>
          <Route path="/pet/:id/edit" element={<PetEditPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Error/i)).toBeInTheDocument();
  });

  it('should modify the pet after form submit and redirect to a pet page', async () => {
    render(
      <MemoryRouter initialEntries={['/pet/1/edit']}>
        <Routes>
          <Route path="/pet/:id/edit" element={<PetEditPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const nameInput = await screen.findByLabelText(/Name/i);
    const categoryInput = await screen.findByLabelText(/Category/i);
    const submitButton = await screen.findByRole('button', { name: /Submit/i });

    fireEvent.change(nameInput, { target: { value: 'Pet 1 Changed' } });
    fireEvent.change(categoryInput, { target: { value: 'Category Changed' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).not.toBeDisabled());
    expect(navigate).toBeCalled();
  });

  it('should not redirect to pet page if pet was not modified', async () => {
    server.use(
      rest.put('http://localhost:3000/pet', (_, res, ctx) =>
        res(ctx.status(500)),
      ),
    );

    render(
      <MemoryRouter initialEntries={['/pet/1/edit']}>
        <Routes>
          <Route path="/pet/:id/edit" element={<PetEditPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const nameInput = await screen.findByLabelText(/Name/i);
    const submitButton = await screen.findByRole('button', { name: /Submit/i });

    fireEvent.change(nameInput, { target: { value: 'Pet 1 Changed' } });
    fireEvent.click(submitButton);

    expect(navigate).not.toBeCalled();
  });
});
