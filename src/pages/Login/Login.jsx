import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAt, FaKey, FaSignInAlt, FaChartLine, FaDoorOpen, FaUserPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import './Login.css';
import InputField from '../../components/textInput/TextInput';
import SubmitButton from '../../components/buttons/SubmitButton';
import ShowAlert from '../../components/ShowAlert/ShowAlert';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error } = useSelector((state) => ({
        loading: state.auth.loading?.userInfo,
        error: state.auth.error?.userInfo,
    }));

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.username.trim()) validationErrors.username = 'Username is required';
        if (!formData.password.trim()) validationErrors.password = 'Password is required';

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const result = await dispatch(
                loginUser({
                    username: formData.username,
                    password: formData.password,
                })
            ).unwrap();

            console.log('Login success:', result);

            ShowAlert('Login successful!', 'success');

            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            console.error('Login failed:', err);
            ShowAlert(`Login failed: ${err.message || 'Check credentials'}`, 'error');
        }
    };

    return (
        <div className="login-container">
            <ToastContainer position="top-right" autoClose={5000} theme="colored" />

            <div className="login-background">
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <div className="logo">
                            <div className="logo-icon"><FaChartLine /></div>
                            <div className="logo-text">
                                <h1>FinanceTracker</h1>
                                <div className="logo-subtitle">Smart Money Management</div>
                            </div>
                        </div>
                        <p className="login-subtitle">
                            <FaDoorOpen /> Welcome back! Sign in to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        <InputField
                            label="Username"
                            icon={FaAt}
                            type="text"
                            name="username"
                            value={formData.username}
                            placeholder="Enter your username"
                            onChange={handleChange}
                            required={true}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}

                        <InputField
                            label="Password"
                            icon={FaKey}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            hasToggle={true}
                            required={true}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}


                        {/* Submit button */}
                        <SubmitButton isLoading={loading}>
                            <FaSignInAlt /> Sign In to Dashboard
                        </SubmitButton>
                    </form>

                    {/* Register link */}
                    <div className="register-section">
                        <p>
                            New to FinanceTracker?{' '}
                            <Link to="/register" className="register-link">
                                <FaUserPlus /> Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
