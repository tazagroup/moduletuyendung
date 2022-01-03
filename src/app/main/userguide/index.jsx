import React, { useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { setDataGuide } from 'app/store/fuse/guideSlice';
import { openDialog } from 'app/store/fuse/dialogSlice';
import { toggleQuickPanel } from 'app/fuse-layouts/shared-components/quickPanel/store/stateSlice';
//MUI
import { IconButton, List, Tooltip, Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from "@mui/material/styles"
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
//COMPONENTS
import Item from './Item'
import ModalCreate from './ModalCreate'
import FuseLoading from '@fuse/core/FuseLoading';
//API
import guideAPI from 'api/guideAPI.js'
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: .8em;
  `);
const CollapseItem = ({ title, open, icon, handleState, render }) => {
    return (
        <>
            <ListItemButton onClick={handleState}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={title} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {/* MAP HERE  */}
                    {render && render.map((item, index) => (
                        <Item key={index} id={item.id} title={item.Step} link={item.Lienket} idGuide={item.idGuide} />
                    ))}

                </List>
            </Collapse>
        </>
    )
}
const index = () => {
    const dispatch = useDispatch()
    const dataGuide = useSelector(state => state.fuse.guides.dataGuide)
    const [openCreate, setOpenCreate] = useState(false)
    const [openTicket, setOpenTicket] = useState(false)
    const [openCandidate, setOpenCandidate] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(async () => {
        let isFetch = true
        if (isFetch && dataGuide.length == 0) {
            const response = await guideAPI.getGuides()
            dispatch(setDataGuide(response.data))
        }
        setIsLoading(false)
        return () => {
            isFetch = false
        }
    })
    const handleOpen = () => {
        handleClosePanel()
        dispatch(openDialog({
            children: <ModalCreate />
        }))
    }
    const handleClosePanel = () => {
        dispatch(toggleQuickPanel())
    }
    const flagTicket = dataGuide.filter(item => item.idModule == 3) || []
    const flagCandidate = dataGuide.filter(item => item.idModule == 4) || []
    const renderTicket = flagTicket.map(item => {
        const flag = JSON.parse(item.Noidung)
        flag.forEach(opt => {
            opt.idGuide = item.id
        })
        return flag
    }).flat(Infinity)
    const renderCandidate = flagCandidate.map(item => {
        const flag = JSON.parse(item.Noidung)
        flag.forEach(opt => {
            opt.idGuide = item.id
        })
        return flag
    }).flat(Infinity)
    return isLoading ?
        <FuseLoading /> : (
            <>
                <List component="nav">
                    <div>
                        <TextTooltip title="Tạo hướng dẫn" onClick={handleOpen}>
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <AddIcon />
                            </IconButton>
                        </TextTooltip>
                    </div>
                    {/* YÊU CẦU TUYỂN DỤNG  */}
                    <CollapseItem
                        title="Yêu cầu tuyển dụng"
                        icon={<WorkIcon />}
                        open={openTicket}
                        handleState={() => { setOpenTicket(state => !state) }}
                        render={renderTicket}
                    />
                    {/* HỒ SƠ ỨNG VIÊN  */}
                    <CollapseItem
                        title="Hồ sơ ứng viên"
                        icon={<AccountCircleRoundedIcon />}
                        open={openCandidate}
                        handleState={() => { setOpenCandidate(state => !state) }}
                        render={renderCandidate}
                    />
                </List>
                {openCreate &&
                    <ModalCreate
                        open={openCreate}
                        handleClose={() => { setOpenCreate(false) }}
                    />
                }
            </>
        )
}

export default index
