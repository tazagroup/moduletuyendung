import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateCandidate } from 'app/store/fuse/candidateSlice';
import { makeStyles, TextField } from '@material-ui/core';
import { Grid, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import axios from 'axios';
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
const CreateCalendar = ({ open, handleClose, candidate }) => {
    const { key: id } = candidate
    const dispatch = useDispatch()
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [censor, setCensor] = useState('')
    const [note, setNote] = useState('')
    const arrayCensor = ["Phạm Chí Kiệt", "Phạm Chí Kiệt 1", "Phạm Chí Kiệt 2"]
    const handleChangeDate = (newValue) => {
        setSelectedDate(newValue)
    }
    const handleChangeCensor = (e, newValue) => {
        setCensor(newValue)
    }
    const handleChangeNote = (e) => {
        const { target: { value } } = e;
        setNote(value)
    }
    const handleCreateCalendar = (e) => {
        const bodyData = {
            LichPV: []
        }
        const newRound = {
            id: 0,
            ThoigianPV: selectedDate.toISOString(),
            Trangthai: 0,
            Danhgia: "",
            Ghichu: note,
        }
        bodyData[`LichPV`].push(newRound)
        const response = axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Candidate/${id}`, bodyData)
        dispatch(updateCandidate(response.data))
    }
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
                    <Grid item xs={12}>
                        <FormControl variant="standard" fullWidth>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                value={censor}
                                onChange={handleChangeCensor}
                                style={{ lineHeight: "20px", fontSize: "15px" }}
                                options={arrayCensor}
                                freeSolo
                                fullWidth={true}
                                renderInput={(params) => <TextField {...params} label={"Người kiểm duyệt"} variant="standard" />}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Thời gian phỏng vấn"
                                    value={selectedDate}
                                    inputFormat="dd/MM/yyyy KK:mm a"
                                    onChange={handleChangeDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            placeholder="Ghi chú"
                            label="Ghi chú"
                            onChange={handleChangeNote}
                            multiline
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" autoFocus type="submit" variant="contained" disabled={censor == '' || note == ''} onClick={handleCreateCalendar}>
                    Tạo lịch phỏng vấn
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateCalendar
