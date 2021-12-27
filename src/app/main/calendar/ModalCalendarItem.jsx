import React, { useState } from 'react'
import { useSelector } from 'react-redux';
//MUI
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, FormControl } from '@mui/material'
import { makeStyles, TextField } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
// COMPONENTS 
import Flatpickr from "react-flatpickr";
const useStyles = makeStyles({
    title: {
        width: "100%",
        textAlign: "center",
        fontSize: "20px !important",
        fontWeight: "bold !important"
    },
    icon: {
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    }
})
const ModalCalendarItem = ({ open, item, handleClose }) => {
    const classes = useStyles()
    const main = item.Title.split("-")
    const users = useSelector(state => state.fuse.tickets.users)
    const [selectedDate, setSelectedDate] = useState(item.ThoigianPV)
    const convertIdUser = (id) => {
        return users.find(option => option.id == item.Nguoiduyet).name
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle className={classes.title}>Lịch phỏng vấn</DialogTitle>
            <CloseIcon className={classes.icon} onClick={handleClose} />
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            value={main[1]}
                            label={"Họ tên ứng viên"}
                            variant="standard"
                            disabled={true}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            value={main[2]}
                            label={"Vị trí ứng tuyển"}
                            variant="standard"
                            disabled={true}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <p style={{ fontSize: "1.3rem", color: "rgba(141, 140, 140, 0.8)" }}>Thời gian phỏng vấn</p>
                        <FormControl fullWidth>
                            <Flatpickr
                                value={selectedDate}
                                options={{
                                    enableTime: true,
                                    dateFormat: "d-m-Y H:i",
                                }}
                                disabled
                                onChange={(dateSelect) => handleChangeDate(dateSelect)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                value={convertIdUser(item.Nguoiduyet)}
                                label={"Người phỏng vấn"}
                                variant="standard"
                                disabled={true}
                                fullWidth
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default ModalCalendarItem
