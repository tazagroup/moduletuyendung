import React from 'react'
import { Controller } from "react-hook-form"
import { TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';
const NumberField = (props) => {
    const { label, form, name, disabled = false } = props
    const control = form.control
    return (
        <Controller
            name={name}
            control={control}
            render={(props) => {
                const { invalid, error } = props.fieldState;
                const { value } = props.field
                return (
                    <NumberFormat
                        {...props.field}
                        label={label}
                        customInput={TextField}
                        thousandSeparator
                        error={invalid}
                        helperText={error?.message}
                        defaultValue={value}
                        allowLeadingZeros={false}
                        fullWidth
                        disabled={disabled}
                    />
                )
            }}
        />
    )
}

export default NumberField
