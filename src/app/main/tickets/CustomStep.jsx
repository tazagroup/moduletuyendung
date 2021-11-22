import React, { Fragment } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
const checkStatus = (status) => {
    if (status === 0) return <HourglassFullIcon className="icon__table wait" />
    else if (status === 1) return <CheckCircleIcon className="icon__table success" />
    return <CancelIcon className="icon__table fail" />
}
const CustomStep = ({ item }) => {
    return (
        <div style={{ alignItems: "center", marginRight: "10px" }}>
            Bước {item.id + 1}-{checkStatus(item.status)}
        </div>
    )
}

export default CustomStep
