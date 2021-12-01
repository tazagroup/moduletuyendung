import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core';
import { Grid, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DateTimePicker } from 'react-rainbow-components';
import CloseIcon from '@mui/icons-material/Close';
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
const CreateCalendar = ({ open, handleClose }) => {
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(new Date())
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'xs'}
        >
            <DialogTitle className={classes.title}>Tạo lịch phỏng vấn</DialogTitle>
            <CloseIcon className={classes.icon} onClick={handleClose} />
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid xs={12}>

                    </Grid>
                    <Grid xs={12}>
                        <DateTimePicker
                            value={selectedDate}
                            onChange={value => setSelectedDate(value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCalendar
