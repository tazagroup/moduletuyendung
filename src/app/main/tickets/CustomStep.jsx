import React, { useState, Fragment } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket } from 'app/store/fuse/ticketsSlice';
import { openDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
//MUI
import Menu from '@mui/material/Menu';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { NestedMenuItem } from 'mui-nested-menu'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { TextField } from '@material-ui/core';
//COMPONENT
import ModalUpdateItem from './ModalUpdateItem'
import ModalApproveCurrency from './ModalApproveCurrency'
import { CustomTooltip } from "./TicketStatus"
//API
import ticketsAPI from "api/ticketsAPI"
const CustomStep = ({ item, data, setDataStatus }) => {
    const dispatch = useDispatch()
    const users = useSelector(state => state.fuse.tickets.users)
    const user = JSON.parse(localStorage.getItem("profile"))
    const steps = JSON.parse(data['Pheduyet'])
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openRefuseDialog, setOpenRefuseDialog] = useState(false);
    const [openAccountantDialog, setOpenAccountantDialog] = useState(false);
    const [reason, setReason] = useState('')
    const handleCloseADialog = async (e) => {
        setOpenAccountantDialog(false)
    }
    const showNotify = () => {
        dispatch(showMessage({
            message: 'Cập nhật phiếu tuyển dụng thành công',
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            },
            variant: 'success'
        }))
    }
    const handleSubClick = (e) => {
        setAnchorEl(null)
        setOpenRefuseDialog(true)
    };
    const handleSubClose = () => {
        setOpenRefuseDialog(false)
    };
    const handleOpen = (e) => {
        const currentPos = item.id + 1
        const stepBTD = [1, 3, 6]
        const stepBGD = [2, 4]
        /*
        CAN CLICK BUTTON WHEN : 
         - Ticket's status unequal 3 ( edit mode )
         - Ticket's step equal array steps
         - If the current step is in mode edit, only previous step can change mode
        */
        const bqlCondition = user.profile.PQTD.includes("5") && currentPos == 1 && item?.Nguoiduyet.includes(user.profile.id)
        const btdCondition = user.profile.PQTD.includes("2") && stepBTD.includes(currentPos - 1)
        const bgdCondition = user.profile.PQTD.includes("3") && stepBGD.includes(currentPos - 1)
        const bktCondition = user.profile.PQTD.includes("4") && currentPos == 6
        if (bqlCondition || btdCondition || bgdCondition || bktCondition) {
            if ((currentPos === steps.length && item.status !== 3) || (currentPos == (steps.length - 1) && steps[`${currentPos}`].status === 3)) {
                setAnchorEl(e.currentTarget)
            }
        }
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleApprove = async (e) => {
        handleClose()
        const value = e.target.innerText
        const flagArray = [...steps]
        let newValue = {}
        if (item.id !== 5 && item.id !== 1) {
            newValue = { ...item, status: 1, Lydo: "", Nguoiduyet: user.profile.id, Ngayupdate: new Date().toISOString() }
            flagArray[`${newValue.id}`] = { ...newValue }
        }
        if (item.id === 1) {
            dispatch(openDialog({
                children:
                    <ModalUpdateItem
                        data={data}
                        censor={value}
                        showNotify={showNotify}
                        setDataStatus={setDataStatus}
                    />
            }))
        }
        else if (item.id === 3) {
            //Choose a censor
            const newStep = { id: item.id + 1, status: 0, Nguoiduyet: value, Ngaytao: new Date().toISOString() }
            flagArray.push(newStep)
        }
        else if (item.id === 5) {
            setOpenAccountantDialog(true)
        }
        //Add new steps ( - step 6th )
        else if (item.id !== 6) {
            //Current user check
            const newStep = { id: item.id + 1, status: 0, Ngaytao: new Date().toISOString() }
            flagArray.push(newStep)
        }
        const bodyData = {
            Trangthai: item === 5 ? 1 : item.Trangthai,
            Pheduyet: JSON.stringify([...flagArray]),
        }
        const response = await ticketsAPI.updateTicket(bodyData, data.key)
        const rowData = {
            ...data,
            Pheduyet: response.data.attributes.Pheduyet
        }
        dispatch(updateTicket(response.data))
        setDataStatus(rowData)
        if (item.id !== 1 && item.id !== 5) {
            showNotify()
        }
    }
    const handleRefuse = async (e) => {
        handleSubClose()
        const flagArray = [...steps]
        const newValue = { ...item, status: 2, Lydo: reason, Ngayupdate: new Date().toISOString() }
        flagArray[`${newValue.id}`] = { ...newValue }
        const bodyData = {
            Pheduyet: JSON.stringify([...flagArray])
        }
        const response = await ticketsAPI.updateTicket(bodyData, data.key)
        const rowData = {
            ...data,
            Pheduyet: response.data.attributes.Pheduyet
        }
        dispatch(updateTicket(response.data))
        setDataStatus(rowData)
        showNotify()
    }
    const handleEdit = async (e) => {
        handleClose()
        const flagArray = [...steps]
        const newValue = { ...item, status: 3, Ngayupdate: new Date().toISOString() }
        //Change previous step's status
        const previousStep = flagArray[`${newValue.id - 1}`]
        flagArray[`${newValue.id - 1}`] = { ...previousStep, status: 0, Ngayupdate: new Date().toISOString() }
        if (newValue.id - 1 == 5) {
            const step = flagArray[1].CPTD
            step.map(item => delete item.CPTT)
            flagArray[1] = { ...flagArray[1], CPTD: step }
        }
        flagArray.splice(newValue.id, 1)
        const bodyData = {
            Trangthai: item === 5 ? 0 : item.Trangthai,
            Pheduyet: JSON.stringify([...flagArray])
        }
        const response = await ticketsAPI.updateTicket(bodyData, data.key)
        dispatch(updateTicket(response.data))
        showNotify()
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
    const findNameById = (id) => {
        return users.find(item => item.id == id).name
    }
    const stepSuccessName = item.id !== 6 ? (item.id === 5 ? "Đã thanh toán" : "Phê duyệt") : "Triển khai tuyển dụng"
    return (
        <div style={{ alignItems: "center", marginLeft: "12px" }}>
            Bước {item.id + 1}-{checkStatus(item.status)}
            {item.id == 0 &&
                <CustomTooltip title={item?.Nguoiduyet.map(item => (<div key={item}>{findNameById(item)}</div>))}>
                    <AccountCircleIcon />
                </CustomTooltip>
            }
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
                        {users.filter(item => item.PQTD.includes("3")).map(item => (
                            <MenuItem key={item.id} onClick={handleApprove}>{item.name}</MenuItem>
                        ))}
                    </NestedMenuItem> : <MenuItem onClick={handleApprove}>{stepSuccessName}</MenuItem>
                }
                {item.status !== 2 && <MenuItem onClick={handleSubClick}>Từ chối</MenuItem>}
                {(item.status !== 3 && item.id !== 0) && <MenuItem onClick={handleEdit}>Sửa lỗi</MenuItem>}
            </Menu>

            {/* Dialog Refuse  */}
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
            {/* Dialog Accountant  */}
            {openAccountantDialog &&
                <ModalApproveCurrency
                    open={openAccountantDialog}
                    data={data}
                    handleClose={handleCloseADialog}
                />
            }
        </div >
    )
}

export default CustomStep
