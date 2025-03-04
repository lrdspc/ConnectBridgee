import React, { ReactNode } from 'react';

interface SmartButtonProps {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

const SmartButton: React.FC<SmartButtonProps> = ({
  children,
  color = 'primary',
  variant = 'filled',
  size = 'md',
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  icon,
  disabled = false
}) => {
  // Mapeamento de cores
  const colorClasses = {
    primary: {
      filled: 'bg-primary-color text-white',
      outlined: 'border border-primary-color text-primary-color',
      ghost: 'text-primary-color'
    },
    secondary: {
      filled: 'bg-gray-600 text-white',
      outlined: 'border border-gray-600 text-gray-600',
      ghost: 'text-gray-600'
    },
    success: {
      filled: 'bg-green-color text-white',
      outlined: 'border border-green-color text-green-color',
      ghost: 'text-green-color'
    },
    danger: {
      filled: 'bg-red-color text-white',
      outlined: 'border border-red-color text-red-color',
      ghost: 'text-red-color'
    },
    warning: {
      filled: 'bg-yellow-color text-white',
      outlined: 'border border-yellow-color text-yellow-color',
      ghost: 'text-yellow-color'
    },
    info: {
      filled: 'bg-teal-color text-white',
      outlined: 'border border-teal-color text-teal-color',
      ghost: 'text-teal-color'
    },
  };
  
  // Mapeamento de tamanhos
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  };
  
  const buttonClasses = `
    smart-button
    ${colorClasses[color][variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    rounded-lg
    transition-all
    duration-200
    flex
    items-center
    justify-center
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default SmartButton;