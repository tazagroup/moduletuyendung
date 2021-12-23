import React, { useState } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateCandidate, updateFlagCandidate } from 'app/store/fuse/candidateSlice'
//MUI
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Grid, Button, Typography } from '@mui/material'
import { makeStyles, TextField } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import Flatpickr from "react-flatpickr";
import Tinymce from '../CustomField/Tinymce'
//API
import candidatesAPI from "api/candidatesAPI"
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
    const [comment, setComment] = useState(item.Danhgia)
    const handleChangeDate = (e) => {
        setSelectedDate(e[0])
    }
    const handleEditCalendar = async (e) => {
        const calendar = JSON.parse(currentStage.LichPV)
        const index = calendar.VongPV.map(option => option.id).indexOf(item.id)
        const newItem = {
            ...item,
            Danhgia: comment,
            Ghichu: note,
            ThoigianPV: new Date(selectedDate).toISOString()
        }
        calendar.VongPV[index] = { ...newItem }
        const bodyData = {
            ...currentStage,
            LichPV: JSON.stringify(calendar)
        }
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        dispatch(updateFlagCandidate(bodyData))
        handleClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'md'}
        >
            <DialogTitle className={classes.title}>Lịch phỏng vấn</DialogTitle>
            <CloseIcon className={classes.icon} onClick={handleClose} />
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Thời gian phỏng vấn</p>
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
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Ghi chú</Typography>
                        <Tinymce value={note} onChange={(e) => { setNote(e) }} label={"ghi chú"} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Đánh giá</Typography>
                        <Tinymce value={comment} onChange={(e) => { setComment(e) }} label={"đánh giá"} />
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
