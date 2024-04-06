import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import { LoadScript } from '@react-google-maps/api';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <LoadScript googleMapsApiKey="AIzaSyBBv6shA-pBM0e9KydvwubSY55chq0gqS8">
            <Suspense>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </Suspense>
        </LoadScript>
    </React.StrictMode>
);

