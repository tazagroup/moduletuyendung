import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Grid, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles, TextField } from '@material-ui/core';
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
const EditCalendar = ({ open, item, handleClose }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const currentStage = useSelector(state => state.fuse.candidates.flagCandidate)
    const [selectedDate, setSelectedDate] = useState(item.ThoigianPV)
    const [note, setNote] = useState(item.Ghichu)
    const [comment, setComment] = useState('')
    const handleChangeDate = (e) => {
        setSelectedDate(e[0])
    }
    const handleEditCalendar = (e) => {
        const calendar = JSON.parse(currentStage.LichPV)
        const index = calendar.VongPV.map(option => option.id).indexOf(item.id)
        const newItem = {
            ...item,
            Danhgia: comment,
            Ghichu: note,
            ThoigianPV: new Date(selectedDate).toISOString()
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'xs'}
        >
            <DialogTitle className={classes.title}>Lịch phỏng vấn</DialogTitle>
            <CloseIcon className={classes.icon} onClick={handleClose} />
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <p style={{ fontSize: "12.5px", color: "rgba(0, 0, 0, 0.6)" }}>Thời gian phỏng vấn</p>
                        <FormControl fullWidth>
                            <Flatpickr
                                value={selectedDate}
                                options={{
                                    enableTime: true,
                                    dateFormat: "d-m-Y H:i",
                                }}
                                onChange={(dateSelect) => handleChangeDate(dateSelect)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={note}
                            label="Ghi chú"
                            multiline
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={(e) => { setNote(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={comment}
                            label="Đánh giá"
                            multiline
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={(e) => { setComment(e.target.value) }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" autoFocus type="submit" variant="contained" onClick={handleEditCalendar}>
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditCalendar
