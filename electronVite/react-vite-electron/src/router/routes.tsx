import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '*', // Matches all undefined routes
        element: <Index />, // A NotFound component to handle 404s
    }

];

export { routes };
