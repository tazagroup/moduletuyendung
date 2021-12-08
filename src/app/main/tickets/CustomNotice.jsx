import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const title = {
    fontSize: "18px",
    textAlign: "center"
}
const icon = {
    cursor: "pointer",
    position: "absolute",
    top: "20px",
    right: "20px"
}
const CustomNotice = ({ item, handleClose }) => {
    return (
        <>
            <Dialog
                open={item.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle style={title}>{item.field}</DialogTitle>
                <CloseIcon style={icon} onClick={handleClose} />
                <DialogContent>
                    <div dangerouslySetInnerHTML={{ __html: item.data }}></div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CustomNotice
