import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../sidebar/Sidebar';
import './Layout.css';
import { ToastContainer } from 'react-toastify';
const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Public routes (no sidebar)
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    return (
        <>
            <ToastContainer />
            {isPublicRoute || !isAuthenticated ? (
                <div className="public-layout">


                    <Outlet />
                </div>
            ) : (
                <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
                    {/* Sidebar */}
                    <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

                    {/* Main content */}
                    <div className="main-container">
                        <main className="main-content">
                            {/* <Navbar></Navbar> */}
                            <Outlet />
                        </main>
                    </div>
                </div>
            )}
        </>
    );
};

export default Layout;
