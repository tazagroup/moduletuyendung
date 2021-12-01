import React, { Fragment } from 'react'
import { useSelector } from 'react-redux';
import { Tooltip, MenuItem, FormControl } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { AiOutlineFileWord, AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai"
export const CustomStatus = ({ item }) => {
    return (
        <Fragment>
            <Tooltip title={item ? "Duyệt" : "Chưa duyệt"}>
                {item ? <CheckCircleIcon className="icon__table__candidate success" /> : <CancelIcon className="icon__table__candidate warning" />}
            </Tooltip>
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

