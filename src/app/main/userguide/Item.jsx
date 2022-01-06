import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from 'app/store/fuse/dialogSlice';
import { updateDataGuide } from 'app/store/fuse/guideSlice'
import { ListItemButton, ListItemText, ListItemIcon, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@material-ui/core';
//COMPONENTS
import ModalItem from './Modal'
import ModalEdit from './ModalEdit'
//API
import guidesAPI from 'api/guideAPI'
const text = {
    fontSize: "12px"
}
const Item = ({ title, link, id, idGuide }) => {
    const dispatch = useDispatch()
    const check = Object.keys(JSON.parse(localStorage.getItem("profile")).groups).includes('8')
    const dataGuide = useSelector(state => state.fuse.guides.dataGuide)
    const [isOpened, setIsOpened] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleItemClick = () => {
        setIsOpened(true)
    }
    const handleOpenMenu = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleEdit = () => {
        setAnchorEl(null)
        dispatch(openDialog({
            children: <ModalEdit title={title} link={link} idGuide={idGuide} id={id} />
        }))
    }
    const handleRemove = async () => {
        setAnchorEl(null)
        const itemGuide = dataGuide.find(opt => opt.id == idGuide)
        const itemContent = JSON.parse(itemGuide.Noidung)
        const index = itemContent.map(item => item.id).indexOf(id)
        itemContent.splice(index, 1)
        const newContent = itemContent.map((item, index) => {
            delete item.id
            return {
                id: index,
                ...item
            }
        })
        const bodyData = {
            ...itemGuide,
            Noidung: JSON.stringify(newContent),
        }
        const response = await guidesAPI.updateGuide(bodyData, bodyData.id)
        dispatch(updateDataGuide(response.data.attributes))
    }
    return (
        <>
            <div style={{ display: "flex", alignItems: "center" }}>
                <ListItemButton
                    onClick={handleItemClick}
                    sx={{ pl: 4 }}
                >
                    <ListItemText primaryTypographyProps={{ style: text }} primary={title} />
                </ListItemButton>
                {check && (
                    <SettingsIcon onClick={handleOpenMenu} />
                )}
            </div>
            {<Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => { setAnchorEl(null) }}
                disableEnforceFocus
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={handleRemove}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    Xóa
                </MenuItem>
            </Menu>}
            {isOpened && <ModalItem open={isOpened} handleClose={() => { setIsOpened(false) }} title={title} link={link} />}
        </>
    )
}
export default Item
