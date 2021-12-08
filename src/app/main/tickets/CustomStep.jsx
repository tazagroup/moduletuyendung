import React, { useState, Fragment } from 'react'
//REDUX
import { useDispatch } from 'react-redux';
import { updateTicket } from 'app/store/fuse/ticketsSlice';
import { openDialog } from 'app/store/fuse/dialogSlice';
//MUI
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Menu from '@mui/material/Menu';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { NestedMenuItem } from 'mui-nested-menu'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import ErrorIcon from '@mui/icons-material/Error';
import NumberFormat from "react-number-format"
import { TextField } from '@material-ui/core';
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
    const [openRefuseDialog, setOpenRefuseDialog] = useState(false);
    const [reason, setReason] = useState('')
    const [currency, setCurrency] = useState('')
    const handleSubClick = (event) => {
        setAnchorEl(null)
        setOpenRefuseDialog(true)
    };
    const handleSubClose = () => {
        setOpenRefuseDialog(false)
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
            Trangthai: item === 5 ? 1 : item.Trangthai,
            Pheduyet: JSON.stringify([...flagArray]),
        }
        const response = await ticketsAPI.updateTicket(bodyData, data.key)
        dispatch(updateTicket(response.data))
    }
    const handleRefuse = async (e) => {
        handleSubClose()
        const flagArray = [...steps]
        const newValue = { ...item, status: 2, Lydo: reason, ngayUpdate: new Date().toISOString() }
        if (item.id === 5) {
            newValue['CPTT'] = currency.split(',').join('')
        }
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
            Trangthai: item === 5 ? 0 : item.Trangthai,
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
                {(item.status !== 3 && item.id !== 0) && <MenuItem onClick={handleEdit}>Sửa lỗi</MenuItem>}
            </Menu>
            <Dialog
                open={openRefuseDialog}
                fullWidth={true}
                maxWidth={"sm"}
            >
                <DialogTitle id="alert-dialog-title" style={{ fontSize: "20px", textAlign: "center" }}>Từ chối phiếu tuyển dụng</DialogTitle>
                <DialogContent>
                    <TextField
                        id="outlined-helperText"
                        onChange={(e) => { setReason(e.target.value) }}
                        label="Lí do"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        style={{ fontSize: "15px" }}
                        fullWidth
                        variant="standard"
                    />
                    {item.id === 5 && <NumberFormat
                        label={"Chi phí thực tế"}
                        onChange={(e) => { setCurrency(e.target.value) }}
                        customInput={TextField}
                        thousandSeparator
                        allowLeadingZeros={false}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        style={{ marginTop: "15px" }}
                    />}
                </DialogContent>
                <DialogActions>
                    <Button color="error" autoFocus type="submit" variant="contained" onClick={handleSubClose}>
                        Đóng
                    </Button>
                    <Button color="primary" autoFocus type="submit" variant="contained" onClick={handleRefuse}>
                        Cập nhật
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default CustomStep
