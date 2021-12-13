import React from 'react'
import { Controller } from "react-hook-form";
import { TextField } from '@material-ui/core';
const InputField = (props) => {
  const { form, name, label, type, disabled = false, variant = "standard" } = props;
  return (
    <Controller
      name={name}
      control={form.control}
      render={(props) => {
        const { invalid, error } = props.fieldState;
        return (
          <TextField
            {...props.field}
            error={invalid}
            helperText={error?.message}
            type={type}
            label={label}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            variant={variant}
            disabled={disabled}
          />
        );
      }}
    />
  )
}

export default InputField
