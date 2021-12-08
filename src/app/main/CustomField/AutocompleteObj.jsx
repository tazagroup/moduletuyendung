import React from 'react'
import { useSelector } from 'react-redux';
import { TextField, Autocomplete } from '@mui/material';
const styleSelect = { lineHeight: "20px", fontSize: "15px" }
const AutocompleteObjField = (props) => {
    const { label, value, onChange, options, disabled = false, field = "" } = props
    const arrayPosition = useSelector(state => state.fuse.tickets.position)
    return (
        <Autocomplete
            {...props}
            disablePortal
            id="combo-box-demo"
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={styleSelect}
            options={options}
            getOptionLabel={option => option[`${field}`]}
            renderOption={(props, option) => {
                const pos = field == "name" && arrayPosition.find(item => item.id == option.id)?.Thuoctinh
                return (
                    <li {...props} key={option.id}>
                        {option[`${field}`]} {`${pos ? "- " + pos : ""}`}
                    </li>
                )
            }}
            fullWidth={true}
            renderInput={(params) => <TextField {...params} label={label} variant="standard" />}
        />
    )
}

export default AutocompleteObjField
