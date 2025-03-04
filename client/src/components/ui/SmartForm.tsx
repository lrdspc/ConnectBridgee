import React, { ReactNode } from 'react';

interface SmartFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export const SmartForm: React.FC<SmartFormProps> = ({
  children,
  onSubmit,
  className = ''
}) => {
  return (
    <form className={`report-form ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

interface SmartFormGroupProps {
  children: ReactNode;
  className?: string;
}

export const SmartFormGroup: React.FC<SmartFormGroupProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`form-group ${className}`}>
      {children}
    </div>
  );
};

interface SmartLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export const SmartLabel: React.FC<SmartLabelProps> = ({
  children,
  htmlFor,
  required = false,
  className = ''
}) => {
  return (
    <label className={`form-label ${className}`} htmlFor={htmlFor}>
      {children} {required && <span className="text-red-color">*</span>}
    </label>
  );
};

interface SmartInputProps {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SmartInput: React.FC<SmartInputProps> = ({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = ''
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`form-control ${className}`}
    />
  );
};

interface SmartTextareaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export const SmartTextarea: React.FC<SmartTextareaProps> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  rows = 4,
  className = ''
}) => {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      rows={rows}
      className={`form-control ${className}`}
    />
  );
};

interface SmartSelectProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export const SmartSelect: React.FC<SmartSelectProps> = ({
  id,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  children
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`form-control ${className}`}
    >
      {children}
    </select>
  );
};

interface SmartCheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const SmartCheckbox: React.FC<SmartCheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`form-check ${className}`}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="form-check-input"
      />
      {label && (
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};