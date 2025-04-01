import { useState, useCallback } from 'react';

type ValidationRule<T> = (value: T[keyof T], values: T) => string | undefined;
type ValidationRules<T> = Partial<Record<keyof T, ValidationRule<T>[]>>;

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

interface FormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => Promise<void>;
}

export const useForm = <T extends Record<string, any>>(options: FormOptions<T>) => {
  const [state, setState] = useState<FormState<T>>({
    values: options.initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
  });

  const validateField = useCallback((field: keyof T, value: T[keyof T]) => {
    const rules = options.validationRules?.[field];
    if (!rules) return undefined;

    for (const rule of rules) {
      const error = rule(value, state.values);
      if (error) return error;
    }
    return undefined;
  }, [options.validationRules, state.values]);

  const validateForm = useCallback(() => {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(state.values).forEach((field) => {
      const value = state.values[field as keyof T];
      const error = validateField(field as keyof T, value);
      if (error) {
        errors[field as keyof T] = error;
        isValid = false;
      }
    });

    setState(prev => ({
      ...prev,
      errors,
      isValid,
    }));

    return isValid;
  }, [state.values, validateField]);

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setState(prev => {
      const newValues = { ...prev.values, [field]: value };
      const error = validateField(field, value);
      return {
        ...prev,
        values: newValues,
        errors: {
          ...prev.errors,
          [field]: error,
        },
        touched: {
          ...prev.touched,
          [field]: true,
        },
      };
    });
  }, [validateField]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setState({
      values: options.initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    });
  }, [options.initialValues]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      await options.onSubmit(state.values);
      setState(prev => ({ ...prev, isSubmitting: false }));
    } catch (error) {
      setState(prev => ({ ...prev, isSubmitting: false }));
      throw error;
    }
  }, [state.values, validateForm, options.onSubmit]);

  return {
    ...state,
    setFieldValue,
    setFieldTouched,
    resetForm,
    handleSubmit,
    validateField,
    validateForm,
  };
}; 