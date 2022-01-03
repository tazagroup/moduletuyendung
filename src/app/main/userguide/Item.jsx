import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { openDialog } from 'app/store/fuse/dialogSlice';
import { ListItemButton, ListItemText, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
//COMPONENTS
import ModalItem from './Modal'
import ModalEdit from './ModalEdit'
const Item = ({ title, link, id, idGuide }) => {
    const dispatch = useDispatch()
    const check = Object.keys(JSON.parse(localStorage.getItem("profile")).groups).includes('8')
    const [isOpened, setIsOpened] = useState(false)
    const handleItemClick = () => {
        setIsOpened(true)
    }
    const handleEdit = () => {
        dispatch(openDialog({
            children: <ModalEdit title={title} link={link} idGuide={idGuide} id={id} />
        }))
    }
    return (
        <>
            <div>
                <ListItemButton
                    onClick={handleItemClick}
                    sx={{ pl: 4 }}
                >
                    <ListItemText primary={title} />
                </ListItemButton>
                {check && (
                    <SettingsIcon onClick={handleEdit} style={{ position: "absolute", top: 8, right: 15, cursor: "pointer" }} />
                )}
            </div>
            {isOpened && <ModalItem open={isOpened} handleClose={() => { setIsOpened(false) }} title={title} link={link} />}
        </>
    )
}
export default Item
