import React, { useState } from 'react'
//REDUX
import { showMessage } from 'app/store/fuse/messageSlice';
import { updateFlagCandidate, updateCandidate } from 'app/store/fuse/candidateSlice'
import { useDispatch, useSelector, batch } from 'react-redux';
//MUI
import { makeStyles } from '@material-ui/core';
import { TextField, Autocomplete } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Flatpickr from "react-flatpickr";
import Tinymce from '../CustomField/Tinymce'
import AutocompleteObjField from "../CustomField/AutocompleteObj"
//API
import candidatesAPI from "api/candidatesAPI"
import noticesAPI from "api/noticesAPI"
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
const CreateCalendar = ({ open, handleClose, candidate, position }) => {
    const dispatch = useDispatch()
    const users = useSelector(state => state.fuse.tickets.users)
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const dataType = useSelector(state => state.fuse.guides.dataType)
    const calendar = JSON.parse(candidate.LichPV)
    const user = JSON.parse(localStorage.getItem("profile"))
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [censor, setCensor] = useState(null)
    const [note, setNote] = useState('')
    const [type, setType] = useState(null)
    const arrayCensor = (Object.keys(calendar).length == 0) ?
        users.filter(item => { if (item.PQTD) { return item.PQTD.includes(2) } })
        : users.filter(item => item.id == dataTicket.find(opt => opt.key == candidate.idTicket).idTao)

    const handleChangeDate = (newValue) => {
        setSelectedDate(newValue[0])
    }
    const handleChangeCensor = (e, newValue) => {
        setCensor(newValue)
    }
    const handleCreateCalendar = async (e) => {
        const main = JSON.parse(candidate.LichPV)
        const profile = JSON.parse(candidate.Profile)
        const emptyObject = Object.keys(main).length == 0
        const flag = {
            ThoigianPV: emptyObject ? new Date(selectedDate).toISOString() : main.ThoigianPV,
            VongPV: emptyObject ? [] : main.VongPV
        }
        const id = emptyObject ? 0 : main.VongPV.length
        const title = `Phỏng vấn vòng ${id + 1}-${profile.Hoten}-${position}`
        const newRound = {
            id: id,
            Nguoiduyet: censor.id,
            ThoigianPV: new Date(selectedDate).toISOString(),
            Trangthai: 0,
            Danhgia: "",
            Ghichu: note,
            Title: title,
            Type: type.id,
            flag: []
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
        batch(() => {
            dispatch(updateFlagCandidate(bodyData))
            dispatch(updateCandidate(response.data))
        })
        const noticeData = {
            "idGui": user.profile.id,
            "idNhan": censor.id,
            "idModule": 4,
            "Loai": 1,
            "Noidung": JSON.stringify({ id: bodyData.key, text: `Bước ${id + 4}`, step: `Phỏng vấn vòng ${id + 1}` }),
            "idTao": user.profile.id
        }
        noticesAPI.postNotice(noticeData)
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
                                options={arrayCensor}
                                onChange={handleChangeCensor}
                                field="name"
                                label="Người phỏng vấn"
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
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={type}
                            onChange={(e, newValue) => { setType(newValue) }}
                            style={{ lineHeight: "20px", fontSize: "15px" }}
                            options={dataType}
                            getOptionLabel={option => `${option[`Thuoctinh`]}`}
                            getOptionDisabled={option => type?.Thuoctinh == option.Thuoctinh}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id} style={{ fontSize: "13px" }}>
                                        {option[`Thuoctinh`]}
                                    </li>
                                )
                            }}
                            fullWidth={true}
                            renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: true }} label={"Hình thức phỏng vấn"} variant="standard" />}
                        />
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
