import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // We'll create this CSS file

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
        // Example: clear tokens, reset state, then navigate
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {/* Logo/Brand */}
                <div className="navbar-brand">
                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="brand-logo" />
                    </Link>
                </div>

                {/* Navigation Icons */}
                <div className="nav-icons">
                    <Link to="/dashboard" className="nav-icon" title="Dashboard">
                        <i className="fas fa-home"></i>
                    </Link>
                    <Link to="/profile" className="nav-icon" title="Profile">
                        <i className="fas fa-user"></i>
                    </Link>
                    <Link to="/messages" className="nav-icon" title="Messages">
                        <i className="fas fa-envelope"></i>
                    </Link>
                    <Link to="/settings" className="nav-icon" title="Settings">
                        <i className="fas fa-cog"></i>
                    </Link>
                </div>
            </div>

            <div className="navbar-right">
                {/* Logout Button */}
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;