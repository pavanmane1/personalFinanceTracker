import React, { memo } from 'react';

const SubmitButton = memo(({ isLoading, children }) => (
    <button
        type="submit"
        className="login-button"
        disabled={isLoading}
        aria-busy={isLoading}
    >
        {isLoading ? (
            <>
                <div className="spinner" aria-hidden="true"></div>
                Loading...
            </>
        ) : (
            children
        )}
    </button>
));

export default SubmitButton;
