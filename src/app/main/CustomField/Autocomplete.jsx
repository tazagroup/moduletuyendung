import React from 'react'
import { FormControl, TextField, Autocomplete } from '@mui/material';
const styleSelect = { lineHeight: "20px", fontSize: "15px" }
const AutocompleteField = (props) => {
    const { label, value, handleChange, arrayItem, disabled = false } = props
    return (
        <FormControl variant="standard" fullWidth>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={value}
                onChange={handleChange}
                disabled={disabled}
                style={styleSelect}
                options={arrayItem}
                freeSolo
                fullWidth={true}
                renderInput={(params) => <TextField {...params} label={label} variant="standard" />}
            />
        </FormControl>
    )
}

export default AutocompleteField
