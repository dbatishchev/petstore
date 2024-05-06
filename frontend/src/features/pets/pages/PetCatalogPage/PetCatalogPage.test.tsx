import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import PetCatalogPage from './PetCatalogPage.tsx';
import { BrowserRouter } from 'react-router-dom';
import { generatePet } from '../../../../../test/generatePet.ts';
import { PetStatusEnum } from '../../api/api.ts';

describe(PetCatalogPage.name, () => {
  const server = setupServer(
    rest.get('http://localhost:3000/pet/findByTags', (_, res, ctx) =>
      res(
        ctx.json([
          generatePet({
            id: 1,
            name: 'Pet 1',
            status: PetStatusEnum.Available,
          }),
          generatePet({ id: 2, name: 'Pet 2', status: PetStatusEnum.Pending }),
        ]),
      ),
    ),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should render loader first', async () => {
    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should render pet names', async () => {
    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    expect(await screen.findByText(/Pet 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Pet 2/i)).toBeInTheDocument();
  });

  it('should render error', async () => {
    server.use(
      rest.get('http://localhost:3000/pet/findByTags', (_, res, ctx) =>
        res(ctx.status(500)),
      ),
    );

    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    expect(await screen.findByText(/Error/i)).toBeInTheDocument();
  });

  it('should render pet images', async () => {
    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    expect(await screen.findByTitle(/Pet 1/i)).toBeInTheDocument();
    expect(await screen.findByTitle(/Pet 2/i)).toBeInTheDocument();
  });

  it('should render filters', async () => {
    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    expect(await screen.findByLabelText(/Status/i)).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/Tags/i)).toBeInTheDocument();
  });

  it('should render learn more buttons', async () => {
    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    expect(await screen.findAllByText(/Learn More/i)).toHaveLength(2);
  });

  it('should render action menu', async () => {
    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    expect(await screen.findAllByLabelText(/more/i)).toHaveLength(2);
  });

  it('should render menu buttons', async () => {
    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    const moreButtons = await screen.findAllByLabelText(/more/i);
    act(() => {
      moreButtons.forEach((btn) => btn.click());
    });

    expect(await screen.findAllByText(/Delete/i)).toHaveLength(2);
    expect(await screen.findAllByText(/Edit/i)).toHaveLength(2);
  });

  it('should render a new list after delete', async () => {
    const response = [
      generatePet({
        id: 1,
        name: 'Pet 1',
        status: PetStatusEnum.Pending,
      }),
      generatePet({
        id: 2,
        name: 'Pet 2',
        status: PetStatusEnum.Pending,
      }),
    ];
    server.use(
      rest.get('http://localhost:3000/pet/findByTags', (_, res, ctx) => {
        return res(ctx.json(response));
      }),
      rest.delete('http://localhost:3000/pet/1', (_, res, ctx) => {
        response.shift();
        return res(ctx.status(204));
      }),
    );

    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    const moreButtons = await screen.findAllByLabelText(/more/i);
    act(() => {
      moreButtons[0].click();
    });

    const deleteButton = await screen.findByText(/Delete/i);
    act(() => {
      deleteButton.click();
    });

    expect(await screen.findByText(/Pet 2/i)).toBeInTheDocument();
    await waitFor(() => {
      return expect(screen.queryByText(/Pet 1/i)).toBeNull();
    });
  });

  it('should fetch pets filtered by status if status is changed', async () => {
    server.use(
      rest.get('http://localhost:3000/pet/findByStatus', (_, res, ctx) => {
        return res(
          ctx.json([
            generatePet({
              id: 3,
              name: 'Pet 3',
              status: PetStatusEnum.Sold,
            }),
            generatePet({
              id: 4,
              name: 'Pet 4',
              status: PetStatusEnum.Sold,
            }),
          ]),
        );
      }),
    );

    render(
      <BrowserRouter>
        <PetCatalogPage />
      </BrowserRouter>,
    );

    await waitFor(() => expect(screen.getByText(/Pet 1/i)).toBeInTheDocument());

    fireEvent.mouseDown((await screen.findAllByRole('combobox'))[0]);
    const listbox = within(await screen.findByRole('listbox'));
    fireEvent.click(listbox.getByText(/sold/i));

    expect(await screen.findByText(/Pet 3/i)).toBeInTheDocument();
    expect(await screen.findByText(/Pet 4/i)).toBeInTheDocument();
  });
});
