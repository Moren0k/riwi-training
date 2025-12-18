import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from '@/styles/components/Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth = false, className = '', id, ...props }, ref) => {
        // Use provided id or fallback to name, or generate a random one if neither exists (though passing id/name is best)
        const inputId = id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
                {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
                <input
                    id={inputId}
                    ref={ref}
                    className={`${styles.input} ${error ? styles.error : ''} ${className}`}
                    {...props}
                />
                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
