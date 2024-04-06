import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';

const finalRoutes = routes.map((route) => {
    return {
        ...route,
        element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <ProtectedRoute routeName={route.path}> <DefaultLayout>{route.element}</DefaultLayout> </ProtectedRoute>,
    };
});

const router = createHashRouter(finalRoutes);

export default router;
