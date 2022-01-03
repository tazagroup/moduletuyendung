import React from 'react'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
const Modal = ({ open, handleClose, title, link }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"md"}
            disableEnforceFocus
        >
            <DialogTitle style={{ fontSize: "20px" }}>{title}</DialogTitle>
            <CloseIcon style={{
                cursor: "pointer",
                position: "absolute",
                top: "20px",
                right: "20px"
            }}
                onClick={handleClose}
            />
            <DialogContent>
                <iframe height="315" src={link} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%" }}>
                </iframe>
            </DialogContent>
        </Dialog>
    )
}

export default Modal
