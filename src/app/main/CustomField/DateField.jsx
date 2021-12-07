import React from 'react'
// import { TextField } from '@material-ui/core';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DatePicker from '@mui/lab/DatePicker';
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";


const DateField = (props) => {
    const { label, value, handleChange, disabled = false } = props
    return (
        <>
            <p style={{ color: "rgba(0,0,0,0.6)",fontSize:"11px" }}>{label}</p>
            <Flatpickr
                value={value} // giá trị ngày tháng
                disabled={disabled}
                options={{
                    dateFormat: "d-m-Y",
                    allowInvalidPreload: true,
                }}
                // event
                onChange={handleChange}
            />
        </>
    )
}

export default DateField
