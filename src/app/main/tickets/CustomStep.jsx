import React, { useState, Fragment } from 'react'
//REDUX
import { useDispatch } from 'react-redux';
import { updateTicket } from 'app/store/fuse/ticketsSlice';
import { openDialog } from 'app/store/fuse/dialogSlice';
//MUI
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NestedMenuItem } from 'mui-nested-menu'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import ErrorIcon from '@mui/icons-material/Error';
//COMPONENT
import ModalUpdateItem from './ModalUpdateItem'
//API
import axios from 'axios'
import ticketsAPI from "api/ticketsAPI"
const CustomStep = ({ item, data }) => {
    const dispatch = useDispatch()
    const steps = JSON.parse(data['Pheduyet'])
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const open2 = Boolean(anchorEl2);
    const [reason, setReason] = useState('')
    const handleSubClick = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleSubClose = () => {
        setAnchorEl2(null);
    };
    const handleOpen = (e) => {
        const currentPos = item.id + 1
        /*
        CAN CLICK BUTTON WHEN : 
         - Ticket's status unequal 3 ( edit mode )
         - Ticket's step equal array steps
         - If the current step is in mode edit, only previous step can change mode
        */
        if ((currentPos === steps.length && item.status !== 3) || (currentPos == (steps.length - 1) && steps[`${currentPos}`].status === 3)) {
            setAnchorEl(e.currentTarget)
        }
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleApprove = async (e) => {
        handleClose()
        const value = e.target.innerText
        const flagArray = [...steps]
        //Change status of step
        const newValue = { ...item, status: 1, Lydo: "", ngayUpdate: new Date().toISOString() }
        flagArray[`${newValue.id}`] = { ...newValue }
        const nextStep = flagArray[`${newValue.id + 1}`]
        if (nextStep) {
            flagArray[`${newValue.id + 1}`] = { ...nextStep, status: 0, Lydo: "", ngayUpdate: new Date().toISOString() }
        }
        else {
            if (item.id === 1 || item.id === 3) {
                //Choose a censor
                const newStep = { id: item.id + 1, status: 0, nguoiDuyet: value, ngayTao: new Date().toISOString() }
                flagArray.push(newStep)
                if (item.id === 1) {
                    dispatch(openDialog({
                        children: <ModalUpdateItem
                            data={data} censor={value} />
                    }))
                }
            }
            //Add new steps ( - step 6th )
            else if (item.id !== 6) {
                //Current user check
                const newStep = { id: item.id + 1, status: 0, nguoiDuyet: "User", ngayTao: new Date().toISOString() }
                flagArray.push(newStep)
            }
        }
        const bodyData = {
            Pheduyet: JSON.stringify([...flagArray]),
        }
        const response = await ticketsAPI.updateTicket(bodyData, data.key)
        dispatch(updateTicket(response.data))
    }
    const handleRefuse = async (e) => {
        handleClose()
        const flagArray = [...steps]
        const newValue = { ...item, status: 2, Lydo: reason, ngayUpdate: new Date().toISOString() }
        flagArray[`${newValue.id}`] = { ...newValue }
        const bodyData = {
            Pheduyet: JSON.stringify([...flagArray])
        }
        const response = await ticketsAPI.updateTicket(bodyData, data.key)
        dispatch(updateTicket(response.data))
    }
    const handleEdit = async (e) => {
        handleClose()
        const flagArray = [...steps]
        const newValue = { ...item, status: 3, ngayTao: new Date().toISOString() }
        //Change previous step's status
        const previousStep = flagArray[`${newValue.id - 1}`]
        flagArray[`${newValue.id - 1}`] = { ...previousStep, status: 0, ngayUpdate: new Date().toISOString() }
        // steps[`${newValue.id}`] = { ...newValue }
        flagArray.splice(newValue.id, 1)
        const bodyData = {
            Pheduyet: JSON.stringify([...flagArray])
        }
        const response = await ticketsAPI.updateTicket(bodyData, data.key)
        dispatch(updateTicket(response.data))
    }
    //RENDER STATUS
    const checkStatus = (status) => {
        let variable;
        if (status === 0) variable = <HourglassFullIcon className="icon__table wait" onClick={handleOpen} />
        else if (status === 1) variable = <CheckCircleIcon className="icon__table success" onClick={handleOpen} />
        else if (status === 3) variable = <ErrorIcon className="icon__table warning" onClick={handleOpen} />
        else variable = <CancelIcon className="icon__table fail" onClick={handleOpen} />
        return (
            <Fragment>
                {variable}
            </Fragment>
        )
    }
    const stepSuccessName = item.id !== 6 ? (item.id === 5 ? "Đã thanh toán" : "Phê duyệt") : "Triển khai tuyển dụng"
    return (
        <div style={{ alignItems: "center", marginLeft: "12px" }}>
            Bước {item.id + 1}-{checkStatus(item.status)}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {item.status !== 1 &&
                    (item.id === 1 || item.id === 3) ?
                    <NestedMenuItem
                        label={"Phê duyệt"}
                        parentMenuOpen={open}
                    >
                        {/* Người duyệt  */}
                        <MenuItem onClick={handleApprove}>Phạm Chí Kiệt</MenuItem>
                        <MenuItem >Phạm Chí Kiệt</MenuItem>
                        <MenuItem >Phạm Chí Kiệt</MenuItem>
                    </NestedMenuItem> : <MenuItem onClick={handleApprove}>{stepSuccessName}</MenuItem>
                }
                {item.status !== 2 && <MenuItem onClick={handleSubClick}>Từ chối</MenuItem>}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl2}
                    open={open2}
                    onClose={handleSubClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem >
                        <TextareaAutosize
                            aria-label="empty textarea"
                            placeholder="Lí do từ chối"
                            style={{ width: "97px" }}
                            onChange={(e) => setReason(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleRefuse()
                                }
                            }
                            }
                        />
                    </MenuItem>
                </Menu>
                {(item.status !== 3 && item.id !== 0) && <MenuItem onClick={handleEdit}>Xử lí</MenuItem>}
            </Menu>
        </div >
    )
}

export default CustomStep
