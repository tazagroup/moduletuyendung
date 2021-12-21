import React, { useState } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateCandidate } from 'app/store/fuse/candidateSlice'
import { showMessage } from 'app/store/fuse/messageSlice';
//MUI
import { makeStyles, TextField } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Flatpickr from "react-flatpickr";
import AutocompleteObjField from "../CustomField/AutocompleteObj"
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
const CreateCalendar = ({ open, handleClose, candidate }) => {
    const dispatch = useDispatch()
    const users = useSelector(state => state.fuse.tickets.users)
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [censor, setCensor] = useState(null)
    const [note, setNote] = useState('')
    const handleChangeDate = (newValue) => {
        setSelectedDate(newValue[0])
    }
    const handleChangeCensor = (e, newValue) => {
        setCensor(newValue)
    }
    const handleCreateCalendar = async (e) => {
        const main = JSON.parse(candidate.LichPV)
        const emptyObject = Object.keys(main).length == 0
        const flag = {
            ThoigianPV: emptyObject ? new Date(selectedDate).toISOString() : main.ThoigianPV,
            VongPV: emptyObject ? [] : main.VongPV
        }
        const newRound = {
            id: emptyObject ? 0 : main.VongPV.length,
            Nguoiduyet: censor.id,
            ThoigianPV: new Date(selectedDate).toISOString(),
            Trangthai: 0,
            Danhgia: "",
            Ghichu: note,
        }
        flag['VongPV'].push(newRound)
        const bodyData = {
            ...candidate,
            LichPV: JSON.stringify(flag)
        }
        dispatch(showMessage({
            message: 'Tạo lịch phỏng vấn thành công',
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            },
            variant: 'success'
        }))
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        dispatch(updateCandidate(response.data))
        handleClose()
    }
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'md'}
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
                        <p style={{ fontSize: "12.5px", color: "rgba(0, 0, 0, 0.6)" }}>Thời gian phỏng vấn</p>
                        <FormControl fullWidth>
                            <Flatpickr
                                value={selectedDate}
                                options={{
                                    enableTime: true,
                                    allowInvalidPreload: true,
                                    dateFormat: "d-m-Y H:i",
                                    static: true,
                                }}
                                onChange={(dateSelect) => handleChangeDate(dateSelect)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Tinymce value={note} onChange={(e) => { setNote(e) }} label={"ghi chú"} />
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
