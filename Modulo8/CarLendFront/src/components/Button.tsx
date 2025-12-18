import React, { ButtonHTMLAttributes } from 'react';
import styles from '@/styles/components/Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    loading?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''
                } ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <span className={styles.spinner}></span> : children}
        </button>
    );
}
