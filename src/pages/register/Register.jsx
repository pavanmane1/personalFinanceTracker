import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaUserPlus,
    FaHandHoldingUsd,
    FaUser,
    FaAt,
    FaEnvelope,
    FaKey,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaUserCheck,
    FaSignInAlt
} from 'react-icons/fa';
import '../Login/Login.css';
import { useDispatch } from 'react-redux';
import { RegisterUser } from '../../features/auth/authSlice';
import ShowAlert from '../../components/ShowAlert/ShowAlert';
import InputField from '../../components/textInput/TextInput';
import SubmitButton from '../../components/buttons/SubmitButton';




const RegisterHeader = memo(() => (
    <div className="login-header">
        <div className="logo">
            <div className="logo-icon"><FaUserPlus /></div>
            <div className="logo-text">
                <h1>Create Account</h1>
                <div className="logo-subtitle">Join FinanceTracker today</div>
            </div>
        </div>
        <p className="login-subtitle">
            <FaHandHoldingUsd /> Manage your money smarter!
        </p>
    </div>
));

const BackgroundShapes = memo(() => (
    <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
    </div>
));

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ Use "fullName" consistently in state
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            ShowAlert(" Passwords do not match!", "error");
            return;
        }

        if (formData.password.length < 6) {
            ShowAlert(" Password must be at least 6 characters long!", "warn");
            return;
        }

        if (!formData.fullName.trim() || !formData.username.trim()) {
            ShowAlert("Please fill in all required fields!", "warn");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name: formData.fullName,
                username: formData.username,
                password: formData.password,
            };

            const result = await dispatch(RegisterUser(payload)).unwrap();

            ShowAlert("🎉 Registration successful! Redirecting to login...", "success");
            console.log("Registration success:", result);
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            console.error("Registration failed:", error);
            ShowAlert(` Error: ${error || 'Registration failed'}`, "error");
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, formData, navigate]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return (
        <div className="login-container">
            <BackgroundShapes />

            <div className="login-background">
                <div className="login-card">
                    <RegisterHeader />

                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        <InputField
                            label="Full Name"
                            icon={FaUser}
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            placeholder="Enter your full name"
                            onChange={handleChange}
                        />

                        <InputField
                            label="Username"
                            icon={FaAt}
                            type="text"
                            name="username"
                            value={formData.username}
                            placeholder="Enter your username"
                            onChange={handleChange}
                        />

                        <InputField
                            label="Password"
                            icon={FaKey}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            placeholder="Create a password (min. 6 characters)"
                            onChange={handleChange}
                            showPassword={showPassword}
                            onTogglePassword={togglePasswordVisibility}
                            hasToggle={true}
                        />

                        <InputField
                            label="Confirm Password"
                            icon={FaLock}
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Re-enter your password"
                            onChange={handleChange}
                        />

                        <SubmitButton isLoading={isLoading}>
                            <FaUserCheck /> Register Account
                        </SubmitButton>
                    </form>

                    <div className="register-section">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="register-link">
                                <FaSignInAlt /> Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Register);
