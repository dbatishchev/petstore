import Layout from '../Layout/Layout';
import PetCatalog from '../../../features/pets/pages/PetCatalogPage/PetCatalogPage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PetDetailPage from '../../../features/pets/pages/PetDetailPage/PetDetailPage.tsx';
import PetEditPage from '../../../features/pets/pages/PetEditPage/PetEditPage.tsx';
import PetCreatePage from '../../../features/pets/pages/PetCreatePage/PetCreatePage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PetCatalog />,
  },
  {
    path: `/pet/create`,
    element: <PetCreatePage />,
  },
  {
    path: `/pet/:id/edit`,
    element: <PetEditPage />,
  },
  {
    path: `/pet/:id`,
    element: <PetDetailPage />,
  },
]);

const App = () => (
  <Layout>
    <RouterProvider router={router} />
  </Layout>
);

export default App;
