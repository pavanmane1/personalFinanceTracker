import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    FaHome,
    FaExchangeAlt,
    FaWallet,
    FaChartLine,
    FaPiggyBank,
    FaCog,
    FaUser,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaChevronDown,
    FaChevronRight,
    FaMoneyBillWave,
    FaCreditCard,
    FaReceipt,
    FaChartPie
} from 'react-icons/fa';
import { logout } from '../../features/auth/authSlice';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    const [expandedItems, setExpandedItems] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Menu items configuration
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <FaHome />,
            path: '/dashboard',
            exact: true
        },
        {
            id: 'transactions',
            label: 'Transactions',
            icon: <FaExchangeAlt />,
            path: '/transactions',
            exact: true
        },

    ];

    const bottomMenuItems = [];

    // Toggle submenu expansion
    const toggleSubmenu = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    // Check if a menu item is active
    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    // Check if any submenu item is active
    const isSubmenuActive = (submenu) => {
        return submenu?.some(item => location.pathname.startsWith(item.path));
    };

    // Auto-expand menu items with active subitems
    useEffect(() => {
        const newExpandedItems = {};
        menuItems.forEach(item => {
            if (item.submenu && isSubmenuActive(item.submenu)) {
                newExpandedItems[item.id] = true;
            }
        });
        setExpandedItems(newExpandedItems);
    }, [location.pathname]);

    // Handle sidebar toggle
    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
        if (onToggle) {
            onToggle(!isCollapsed);
        }
    };

    // Logout functionality
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Render menu items
    const renderMenuItem = (item) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isItemActive = isActive(item);
        const isSubmenuExpanded = expandedItems[item.id];

        return (
            <div key={item.id} className="menu-item-wrapper">
                <Link
                    to={hasSubmenu ? '#' : item.path}
                    className={`menu-item ${isItemActive ? 'active' : ''} ${hasSubmenu ? 'has-submenu' : ''}`}
                    onClick={(e) => {
                        if (hasSubmenu) {
                            e.preventDefault();
                            toggleSubmenu(item.id);
                        }
                    }}
                >
                    <div className="menu-item-content">
                        <span className="menu-icon">{item.icon}</span>
                        {!isCollapsed && <span className="menu-label">{item.label}</span>}
                    </div>
                    {hasSubmenu && !isCollapsed && (
                        <span className="submenu-toggle">
                            {isSubmenuExpanded ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                    )}
                </Link>

                {hasSubmenu && isSubmenuExpanded && !isCollapsed && (
                    <div className="submenu">
                        {item.submenu.map(subItem => (
                            <Link
                                key={subItem.id}
                                to={subItem.path}
                                className={`submenu-item ${location.pathname.startsWith(subItem.path) ? 'active' : ''}`}
                            >
                                <span className="submenu-icon">{subItem.icon}</span>
                                <span className="submenu-label">{subItem.label}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={() => onToggle(false)} />}

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                {/* Sidebar Header */}
                <div className="sidebar-header">
                    <div className="logo-section">
                        <div className="logo">
                            <FaWallet />
                        </div>
                        {!isCollapsed && (
                            <div className="logo-text">
                                <h2>FinanceTracker</h2>
                                <span className="logo-subtitle">Manage Your Money</span>
                            </div>
                        )}
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={handleToggle}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <FaBars /> : <FaTimes />}
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    <div className="menu-section">
                        <div className="menu-title">{!isCollapsed && 'MAIN MENU'}</div>
                        <div className="menu-items">{menuItems.map(renderMenuItem)}</div>
                    </div>

                    {/* <div className="menu-section">
                        <div className="menu-title">{!isCollapsed && 'ACCOUNT'}</div>
                        <div className="menu-items">
                            {bottomMenuItems.map(item => (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`menu-item ${isActive(item) ? 'active' : ''}`}
                                >
                                    <div className="menu-item-content">
                                        <span className="menu-icon">{item.icon}</span>
                                        {!isCollapsed && <span className="menu-label">{item.label}</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div> */}
                </nav>

                {/* User Profile Section */}
                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            <FaUser />
                        </div>
                        {!isCollapsed && (
                            <div className="user-info">
                                <div className="user-name">{userInfo?.user?.name || 'John Doe'}</div>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button className="logout-btn" onClick={handleLogout}>
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
