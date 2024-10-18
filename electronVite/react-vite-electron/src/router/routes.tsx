import { lazy } from 'react';
import Login from '../pages/auth/login';
const Index = lazy(() => import('../pages/Index'));
const Error = lazy(() => import('../components/Error'));

const routes = [
    {
        path: "/auth/login",
        element: <Login />,
        layout: "blank",
    },
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '*', // Matches all undefined routes
        element: <Error />, // A NotFound component to handle 404s
    }

];

export { routes };
