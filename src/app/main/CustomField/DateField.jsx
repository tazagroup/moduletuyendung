import React from 'react'
import { TextField } from '@material-ui/core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
const DateField = (props) => {
    const { label, value, handleChange, disabled = false } = props
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                views={['year', 'month', 'day']}
                label={label}
                value={value}
                onChange={(newValue) => {
                    handleChange(newValue.toISOString());
                }}
                inputFormat="dd/MM/yyyy"
                disabled={disabled}
                renderInput={(params) => <TextField {...params} fullWidth />}
            />
        </LocalizationProvider>
    )
}

export default DateField
