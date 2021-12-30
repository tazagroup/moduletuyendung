import React from 'react'
import { FormControl, MenuItem, Select, InputLabel } from '@mui/material';
const styleLabel = { fontSize: "15px", paddingBottom: "4px" }
const styleSelect = { lineHeight: "20px", fontSize: "15px" }
const SelectField = (props) => {
    const { label, value, handleChange, arrayItem, disabled = false, arraySubItem = [] } = props
    return (
        <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="demo-customized-textbox" style={styleLabel} shrink={true}>{label}</InputLabel>
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={value}
                onChange={handleChange}
                label={label}
                placeholder={label}
                MenuProps={{ disablePortal: true }}
                style={styleSelect}
                disabled={disabled}
            >
                {arrayItem.map((item, index) => {
                    return (
                        <MenuItem key={index} value={item} disabled={arraySubItem.includes(item)}>{item}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default SelectField
