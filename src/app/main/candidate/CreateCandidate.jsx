import React, { useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { addCandidate } from 'app/store/fuse/candidateSlice';
import { showMessage } from "app/store/fuse/messageSlice"

//MUI
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Grid, InputLabel, MenuItem, FormControl, Box,
    Typography, Select, CircularProgress
} from '@mui/material';

import { TextField, makeStyles } from '@material-ui/core';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
//COMPONENTS
import InputField from "../CustomField/InputField"
import DateField from "../CustomField/DateField"
import NumberFormat from 'react-number-format';
import AutocompleteField from './../CustomField/Autocomplete'
import AutocompleteObjField from '../CustomField/AutocompleteObj';
// API
import axios from 'axios';
import { storage } from "../../services/firebaseService/fireBase"
import candidatesAPI from 'api/candidatesAPI';
import noticesAPI from 'api/noticesAPI'
const schema = yup.object().shape({
    Hoten: yup.string().required("Vui lòng nhập tên ứng viên"),
    Email: yup.string().email("Vui lòng nhập đúng định dạng email").required("Vui lòng nhập email"),
    SDT: yup.string().required("Vui lòng nhập số điện thoại"),
});
const useStyles = makeStyles({
    field: {
        marginTop: "15px !important"
    },
    select: {
        fontSize: "15px !important"
    },
    label: {
        fontSize: "15px !important"
    },
    icon: {
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    }
})
const CreateCandidate = ({ open, item = "", handleClose }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const users = useSelector(state => state.fuse.tickets.users)
    const mainSource = useSelector(state => state.fuse.tickets.source)
    const position = useSelector(state => state.fuse.tickets.position)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")))
    const [ticket, setTicket] = useState(item)
    const [tickets, setTickets] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [fileName, setFileName] = useState("")
    const [isFileEmpty, setIsFileEmpty] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [source, setSource] = useState(null)
    const [valueCensor, setValueCensor] = useState(null)
    const arraySource = ticket != "" ? JSON.parse(ticket.Pheduyet)[3].CPTD.map(item => mainSource.find(opt => opt.id == item.Nguon).Thuoctinh) : []
    useEffect(async () => {
        //GET THE CURRENT TICKETS
        const tickets = dataTicket.filter(item => item.Trangthai == 2)
        setTickets(tickets)
        return () => { }
    }, [])
    const handleChangeCensor = (event, newValue) => {
        setValueCensor(newValue)
    }
    const getPositionById = (id) => {
        return position.find(item => item.id == id)?.Thuoctinh
    }
    const form = useForm({
        defaultValues: {
            Hoten: "",
            Email: "",
            SDT: "",
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });
    const isValid = form.formState.isValid && fileName !== "" && source != null
    const handleCreateCandidate = async (e) => {
        const profile = {
            Hoten: e.Hoten,
            Email: e.Email,
            Phone: e.SDT,
            CV: fileName,
            Nguon: mainSource.find(opt => opt.Thuoctinh == source).id,
            NgayUT: new Date(selectedDate).toISOString(),
        }
        const bodyData = {
            idTicket: ticket.key,
            Profile: JSON.stringify(profile),
            LichPV: JSON.stringify({}),
            XacnhanHS: JSON.stringify({ Duyet: { Nguoiduyet: valueCensor ? valueCensor.id : user.profile.id, status: 0 } }),
            DuyetHS: JSON.stringify({}),
            DanhgiaHS: JSON.stringify({}),
            idTao: user.profile.id
        }
        const response = await candidatesAPI.postCandidate(bodyData)
        dispatch(addCandidate(response.data))
        handleClose();
        if (valueCensor) {
            const noticeData = {
                "idGui": user.profile.id,
                "idNhan": valueCensor.id,
                "idModule": 4,
                "Loai": 1,
                "Noidung": JSON.stringify({ id: response.data.attributes.key, text: "Bước 2", step: "Duyệt hồ sơ" }),
                "idTao": user.profile.id
            }
            noticesAPI.postNotice(noticeData)
        }
    }
    const handleUploadFile = (e) => {
        const file = e.target.files[0]
        if (file?.type != "application/pdf") {
            dispatch(showMessage({
                message: 'Lỗi...Vui lòng nhập file định dạng .pdf',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                },
                variant: 'error'
            }))
        }
        else {
            setIsLoading(true)
            const uploadFile = storage.ref(`files/${file.name}`).put(file);
            uploadFile.on("state_changed", (snapshot) => {
            },
                (error) => console.log(error),
                () => {
                    storage.ref("files").child(file.name).getDownloadURL().then((url) => {
                        setIsLoading(false)
                        setFileName(url)
                    })
                })
        }
    }
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'lg'}
        >
            <form onSubmit={form.handleSubmit(handleCreateCandidate)} style={{ position: "relative" }}>
                {isLoading && (
                    <div className='loading__screen'>
                        <CircularProgress className="loading__icon" color="secondary" />
                    </div>
                )}
                <DialogTitle id="alert-dialog-title" style={{ width: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>Tạo hồ sơ ứng viên</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="demo-simple-select-filled-label" className={classes.label}>Phiếu tuyển dụng</InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    className={classes.select}
                                    value={ticket}
                                    renderValue={value => {
                                        return (value && Object.keys(value).length !== 0) ? <div>{getPositionById(value.Vitri)}</div> : <></>
                                    }}
                                    onChange={(e) => setTicket(e.target.value)}
                                >
                                    {tickets && tickets.map(item => (
                                        <MenuItem key={item.key} value={item} className="menu__item">{getPositionById(item.Vitri)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label={"Vị trí tuyển dụng"}
                                fullWidth
                                value={getPositionById(ticket.Vitri) || ''}
                                variant="standard"
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <NumberFormat
                                label={"Mức lương dự kiến"}
                                customInput={TextField}
                                thousandSeparator
                                value={ticket.LuongDK || ''}
                                allowLeadingZeros={false}
                                fullWidth
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AutocompleteField
                                value={source}
                                label="Nguồn"
                                handleChange={(e, newValue) => { setSource(newValue) }}
                                arrayItem={arraySource}
                                disabled={ticket == ""}
                                style={{ color: "rgba(0, 0, 0, 0.38) !important" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InputField form={form} name="Hoten" label={"Họ tên ứng viên"} type="text" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InputField form={form} name="Email" label={"Email"} type="text" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InputField form={form} name="SDT" label={"Số điện thoại"} type="number" />
                        </Grid>
                        <Grid item xs={12}>
                            <DateField label="Ngày ứng tuyển" value={selectedDate} handleChange={setSelectedDate} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Hồ sơ"
                                type="file"
                                error={isFileEmpty}
                                helperText={isFileEmpty ? "Vui lòng nhập hồ sơ ứng viên" : ""}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                onChange={handleUploadFile}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <AutocompleteObjField
                                value={valueCensor}
                                options={users.filter(item => item.PQTD && (item.PQTD.includes(1) || item.PQTD.includes(5)))}
                                onChange={handleChangeCensor}
                                field="name"
                                label="Quản lí phê duyệt"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="error" autoFocus type="submit" variant="contained" size="large" onClick={() => { handleClose() }}>
                        Hùy
                    </Button>
                    <Button color="primary" autoFocus type="submit" disabled={!isValid} variant="contained" size="large">
                        Tạo hồ sơ
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateCandidate
