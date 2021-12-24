import React, { Fragment, useState } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateCandidate } from 'app/store/fuse/candidateSlice';
//MUI
import { Tooltip, Menu, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import { AiOutlineFileWord, AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai"
import { styled } from "@mui/material/styles"
//COMPONENTS
import ModalBeforeSubmitting from './ModalBeforeSubmiting';
//API
import candidatesAPI from 'api/candidatesAPI';
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: 1em;
  `);
export const CustomStatus = ({ item, field }) => {
    const dispatch = useDispatch()
    const flagCandidate = useSelector(state => state.fuse.candidates.flagCandidate)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (e) => {
        if (item === 0) {
            setAnchorEl(e.currentTarget)
        }
    }
    const handleClose = (e) => {
        setAnchorEl(null)
    }
    //RENDER STATUS
    const checkStatus = (status) => {
        let variable;
        if (status == 0) variable = <HourglassFullIcon className="icon__table__candidate pending" onClick={handleOpen} />
        else if (status == 1) variable = <CheckCircleIcon className="icon__table__candidate success" />
        else variable = <CancelIcon className="icon__table__candidate warning" />
        return (
            <TextTooltip title={status != 0 ? (status == 1 ? "Đã duyệt" : "Từ chối") : "Chờ xử lí"}>
                {variable}
            </TextTooltip>
        )
    }
    const handleApprove = async () => {
        const flag = JSON.parse(flagCandidate['XacnhanHS'])
        const newStatus = {
            Duyet: field == "Duyet" ? 1 : flag?.Duyet,
            XNPV: field == "XNPV" ? 1 : 0
        }
        const bodyData = {
            ...flagCandidate,
            XacnhanHS: JSON.stringify(newStatus)
        }
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        dispatch(updateCandidate(response.data))
        handleClose();
    }
    return (
        <Fragment>
            {checkStatus(item)}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleApprove}>Duyệt</MenuItem>
                <MenuItem>Từ chối</MenuItem>
            </Menu>
        </Fragment>
    )
}

export const CustomCV = ({ item }) => {
    var arrStr = item.split('%2F')[1].split('?alt')[0]
    const type = arrStr.split('.')[1]
    return (
        <Fragment>
            <TextTooltip title="Tải cv">
                <a href={item}>
                    {type !== "docx" ? (type === "xlsx" ? <AiOutlineFileExcel className="excel__file" /> : <AiOutlineFilePdf className="ppt__file" />) : <AiOutlineFileWord className="word__file" />}
                </a>
            </TextTooltip>
        </Fragment>
    )
}

//CUSTOM STEP


export const CustomExperts = ({ item }) => {
    const valueStep = JSON.parse(item.DuyetHS).DuyetSPV
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditing, setIsEditing] = useState(false)
    const open = Boolean(anchorEl);
    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = (e) => {
        setAnchorEl(null)
    }
    //RENDER STATUS
    const checkStatus = (status) => {
        let variable;
        if (status == 0) variable = <HourglassFullIcon className="icon__table__candidate pending" onClick={handleOpen} />
        else if (status == 1) variable = <CheckCircleIcon className="icon__table__candidate success" />
        else variable = <CancelIcon className="icon__table__candidate warning" />
        return (
            <TextTooltip title={status != 0 ? (status == 1 ? "Đã duyệt" : "Từ chối") : "Chờ xử lí"}>
                {variable}
            </TextTooltip>
        )
    }
    const handleApprove = () => {
        setIsEditing(true)
        handleClose();
    }
    return (
        <Fragment>
            {checkStatus(valueStep)}
            {
                isEditing &&
                <ModalBeforeSubmitting
                    open={isEditing}
                    handleClose={handleClose}
                    item={item}
                />
            }
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleApprove}>Duyệt</MenuItem>
                <MenuItem>Từ chối</MenuItem>
            </Menu>
        </Fragment>
    )
}