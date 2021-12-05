import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateCandidate } from 'app/store/fuse/candidateSlice';
import { Tooltip, FormControl, Menu, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import { AiOutlineFileWord, AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai"
import axios from 'axios';
export const CustomStatus = ({ item, field }) => {
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (e) => {
        if (item[`${field}`] === 0) {
            setAnchorEl(e.currentTarget)
        }
    }
    const handleClose = (e) => {
        setAnchorEl(null)
    }
    const handleApprove = async (e) => {
        handleClose()
        let bodyData = { ...item }
        delete bodyData.tableData
        if (field === "DuyetCV") {
            bodyData = { ...item, DuyetCV: 1, MoiPV: 0 }
        }
        else {
            bodyData = { ...item, MoiPV: 1 }
        }
        const response = await axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Candidate/${item.key}`, bodyData)
        dispatch(updateCandidate(response.data))
    }
    const handleRefuse = async (e) => {
        handleClose()
        let bodyData = { ...item }
        delete bodyData.tableData
        if (field === "DuyetCV") {
            bodyData = { ...item, DuyetCV: -1 }
        }
        else {
            bodyData = { ...item, MoiPV: -1 }
        }
        const response = await axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Candidate/${item.key}`, bodyData)
        dispatch(updateCandidate(response.data))
    }
    //RENDER STATUS
    const checkStatus = (status) => {
        let variable;
        if (status === 0) variable = <HelpIcon onClick={handleOpen} />
        else if (status === 1) variable = <CheckCircleIcon className="icon__table__candidate success" onClick={handleOpen} />
        else variable = <CancelIcon className="icon__table__candidate warning" onClick={handleOpen} />
        return (
            <Tooltip title={status !== 0 ? (status === 1 ? "Đã duyệt" : "Từ chối") : "Chờ xử lí"}>
                {variable}
            </Tooltip>
        )
    }
    return (
        <Fragment>
            {checkStatus(item[`${field}`])}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleApprove}>Đạt</MenuItem>
                <MenuItem onClick={handleRefuse}>Không đạt</MenuItem>
            </Menu>
        </Fragment>
    )
}

export const CustomCV = ({ item }) => {
    var arrStr = item.split('%2F')[1].split('?alt')[0]
    const type = arrStr.split('.')[1]
    return (
        <Fragment>
            <a href={item}>
                {type !== "docx" ? (type === "xlsx" ? <AiOutlineFileExcel className="excel__file" /> : <AiOutlineFilePdf className="ppt__file" />) : <AiOutlineFileWord className="word__file" />}
            </a>
        </Fragment>
    )
}

