import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateCandidate } from 'app/store/fuse/candidateSlice';
import { makeStyles, TextField } from '@material-ui/core';
import { Grid, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Flatpickr from "react-flatpickr";
import AutocompleteObjField from "../CustomField/AutocompleteObj"
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
    const dispatch = useDispatch()
    const users = useSelector(state => state.fuse.tickets.users)
    console.log(users)
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [censor, setCensor] = useState([])
    const [note, setNote] = useState('')
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
        console.log(bodyData)
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
                            <AutocompleteObjField
                                value={censor}
                                options={users.filter(item => Array.isArray(item.PQTD) ? item.PQTD.includes("3") : item.PQTD == 3)}
                                onChange={handleChangeCensor}
                                field="name"
                                label="Người kiểm duyệt"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
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
