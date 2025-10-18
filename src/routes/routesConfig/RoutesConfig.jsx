import { lazy } from 'react';
import PublicRoute from '../public/PublicRoutes';
import PrivateRoute from '../private/PrivateRoutes';
import { Navigate } from 'react-router-dom';

// Lazy load all components
const Layout = lazy(() => import('../../components/layout/Layout'));
const Login = lazy(() => import('../../pages/Login/Login'));
const Register = lazy(() => import('../../pages/register/Register'));
const Dashboard = lazy(() => import('../../pages/dashboard/Dashboard'));
const Transactions = lazy(() => import('../../pages/transactions/Transactions'));

const routes = [
    // Public routes (without layout)
    {
        path: '/login',
        element: <PublicRoute element={<Login />} />
    },
    {
        path: '/register',
        element: <PublicRoute element={<Register />} />
    },

    // Private routes (with layout)
    {
        path: '/',
        element: <PrivateRoute element={<Layout />} />,
        children: [
            { path: '/', element: <Navigate to="/dashboard" replace /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/transactions', element: <Transactions /> },
        ]
    },

    // Fallback
    { path: '*', element: <Navigate to="/login" replace /> }
];

export default routes;