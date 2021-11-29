import React, { useState, Fragment } from 'react'
import { useDispatch } from 'react-redux';
import { openDialog } from 'app/store/fuse/dialogSlice';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NestedMenuItem } from 'mui-nested-menu'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios'
import ModalUpdateItem from './ModalUpdateItem'


const CustomStep = ({ item, data, setIsFetching }) => {
    const dispatch = useDispatch()
    const steps = data['Pheduyet']
    const idTicket = data.key
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
        //Change status of step
        const newValue = { ...item, status: 1, Lydo: "", ngayUpdate: new Date().toISOString() }
        steps[`${newValue.id}`] = { ...newValue }
        const nextStep = steps[`${newValue.id + 1}`]
        if (nextStep) {
            steps[`${newValue.id + 1}`] = { ...nextStep, status: 0, Lydo: "", ngayUpdate: new Date().toISOString() }
        }
        else {
            if (item.id === 1 || item.id === 3) {
                //Choose a censor
                const newStep = { id: item.id + 1, status: 0, nguoiDuyet: value, ngayTao: new Date().toISOString() }
                steps.push(newStep)
                if (item.id === 1) {
                    dispatch(openDialog({
                        children: <ModalUpdateItem
                            data={data} censor={value}
                            setIsFetching={setIsFetching} />
                    }))
                }
            }
            //Add new steps ( - step 6th )
            else if (item.id !== 6) {
                //Current user check
                const newStep = { id: item.id + 1, status: 0, nguoiDuyet: "User", ngayTao: new Date().toISOString() }
                steps.push(newStep)
            }
        }
        await axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets/${idTicket}`, {
            Pheduyet: steps,
            Tinhtrang: item.id === 5 ? "Đã thanh toán" : item.Tinhtrang
        })
        setIsFetching(state => !state)
    }
    const handleRefuse = async (e) => {
        handleClose()
        const newValue = { ...item, status: 2, Lydo: reason, ngayUpdate: new Date().toISOString() }
        steps[`${newValue.id}`] = { ...newValue }
        await axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets/${idTicket}`, {
            Pheduyet: steps
        })
        setIsFetching(state => !state)
    }
    const handleEdit = async (e) => {
        handleClose()
        const newValue = { ...item, status: 3, ngayTao: new Date().toISOString() }
        //Change previous step's status
        const previousStep = steps[`${newValue.id - 1}`]
        steps[`${newValue.id - 1}`] = { ...previousStep, status: 0, ngayUpdate: new Date().toISOString() }
        // steps[`${newValue.id}`] = { ...newValue }
        steps.splice(newValue.id, 1)
        await axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets/${idTicket}`, {
            Pheduyet: steps
        })
        setIsFetching(state => !state)
    }
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
                    (item.id === 1 || item.id === 3) ? <NestedMenuItem
                        label={"Phê duyệt"}
                        parentMenuOpen={open}
                    >
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
