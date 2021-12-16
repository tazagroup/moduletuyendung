import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Tooltip, FormControl, Menu, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import { AiOutlineFileWord, AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai"
import { styled } from "@mui/material/styles"
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      color: lightblue;
      background-color: green;
      font-size: 1.5em;
  `);
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

    //RENDER STATUS
    const checkStatus = (status) => {
        let variable;
        if (status === 0) variable = <HelpIcon onClick={handleOpen} />
        else if (status === 1) variable = <CheckCircleIcon className="icon__table__candidate success" onClick={handleOpen} />
        else variable = <CancelIcon className="icon__table__candidate warning" onClick={handleOpen} />
        return (
            <TextTooltip title={status !== 0 ? (status === 1 ? "Đã duyệt" : "Từ chối") : "Chờ xử lí"}>
                {variable}
            </TextTooltip>
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
            <Tooltip title="Tải cv">
                <a href={item}>
                    {type !== "docx" ? (type === "xlsx" ? <AiOutlineFileExcel className="excel__file" /> : <AiOutlineFilePdf className="ppt__file" />) : <AiOutlineFileWord className="word__file" />}
                </a>
            </Tooltip>
        </Fragment>
    )
}

