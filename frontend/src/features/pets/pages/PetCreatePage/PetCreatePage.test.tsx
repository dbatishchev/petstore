import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter } from 'react-router-dom';
import { generatePet } from '../../../../../test/generatePet.ts';
import { PetStatusEnum } from '../../api/api.ts';
import PetCreatePage from './PetCreatePage.tsx';
import * as router from 'react-router';

describe(PetCreatePage.name, () => {
  const server = setupServer(
    rest.post('http://localhost:3000/pet', (_, res, ctx) =>
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

  it('should render create form', async () => {
    render(
      <MemoryRouter>
        <PetCreatePage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Name/i)).toBeInTheDocument();
    expect(await screen.findByText(/Status/i)).toBeInTheDocument();
    expect(await screen.findByText(/Category/i)).toBeInTheDocument();
  });

  it('should create a pet after form submit and redirect to a pet page', async () => {
    render(
      <MemoryRouter>
        <PetCreatePage />
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

  it('should not redirect to pet page if pet was not created', async () => {
    server.use(
      rest.post('http://localhost:3000/pet', (_, res, ctx) =>
        res(ctx.status(500)),
      ),
    );

    render(
      <MemoryRouter>
        <PetCreatePage />
      </MemoryRouter>,
    );

    const nameInput = await screen.findByLabelText(/Name/i);
    const submitButton = await screen.findByRole('button', { name: /Submit/i });

    fireEvent.change(nameInput, { target: { value: 'Pet 1 Changed' } });
    fireEvent.click(submitButton);

    expect(navigate).not.toBeCalled();
  });

  it('should not allow to submit form if name is not filled', async () => {
    render(
      <MemoryRouter>
        <PetCreatePage />
      </MemoryRouter>,
    );

    const categoryInput = await screen.findByLabelText(/Category/i);
    fireEvent.change(categoryInput, { target: { value: 'Category Changed' } });
    const submitButton = await screen.findByRole('button', { name: /Submit/i });

    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).not.toBeDisabled());
    expect(navigate).not.toBeCalled();
  });

  it('should not allow to submit form if category is not filled', async () => {
    render(
      <MemoryRouter>
        <PetCreatePage />
      </MemoryRouter>,
    );

    const nameInput = await screen.findByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Pet 1 Name Changed' } });
    const submitButton = await screen.findByRole('button', { name: /Submit/i });

    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).not.toBeDisabled());
    expect(navigate).not.toBeCalled();
  });
});
