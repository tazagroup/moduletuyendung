import React, { Fragment } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import axios from 'axios'
const CustomStep = ({ item, data }) => {
    const steps = data['Pheduyet']
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (e) => {
        const currentPos = item.id + 1
        if (currentPos === steps.length || (currentPos == (steps.length - 1) && steps[`${currentPos}`].status === "0")) {
            setAnchorEl(e.currentTarget)
        }
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleApprove = () => {
        handleClose()
        //Change status of step
        const newValue = { ...item, status: 1 }
        steps[`${newValue.id}`] = { ...newValue }
        const newStep = { id: item + 1, status: 0, ...item }
        //Add new steps

    }
    const checkStatus = (status) => {
        let variable;
        if (status === "0") variable = <HourglassFullIcon className="icon__table wait" onClick={handleOpen} />
        else if (status === "1") variable = <CheckCircleIcon className="icon__table success" onClick={handleOpen} />
        else variable = <CancelIcon className="icon__table fail" onClick={handleOpen} />
        return (
            <Fragment>
                {variable}
            </Fragment>
        )
    }
    return (
        <div style={{ alignItems: "center", marginLeft: "12px" }}>
            Bước {item.id + 1}-{checkStatus(item.status)}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {item.status !== "1" && <MenuItem onClick={handleApprove}>Phê duyệt</MenuItem>}
                {item.status !== "2" && <MenuItem>Từ chối</MenuItem>}
                {item.status !== "0" && <MenuItem>Chờ xử lí</MenuItem>}
            </Menu>
        </div >
    )
}

export default CustomStep
