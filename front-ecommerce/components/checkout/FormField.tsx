import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  id: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  register,
  error,
  disabled = false,
  type = 'text',
  placeholder,
  className = '',
}) => {
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1 block">
        {label}
      </Label>
      <Input
        {...register}
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : 'false'}
        className={error ? 'border-red-500 focus:border-red-500' : ''}
      />
      {error && (
        <span 
          id={errorId}
          className="text-red-500 text-sm mt-1 block"
          role="alert"
        >
          {error.message}
        </span>
      )}
    </div>
  );
};

export default FormField; 