import React, { memo } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = memo(({
    label,
    icon: Icon,
    type,
    name,
    value,
    placeholder,
    onChange,
    showPassword,
    onTogglePassword,
    hasToggle = false,
    required = true
}) => (
    <div className="form-group">
        <label htmlFor={name} className="form-label">
            <Icon /> {label}
        </label>
        <div className="input-wrapper">
            <Icon className="input-icon" />
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="form-input"
                required={required}
            />
            {hasToggle && (
                <button
                    type="button"
                    className="password-toggle"
                    onClick={onTogglePassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            )}
        </div>
    </div>
));

export default InputField;
