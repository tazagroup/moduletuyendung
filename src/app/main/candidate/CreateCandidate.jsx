import React, { useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { addCandidate } from 'app/store/fuse/candidateSlice';
import { showMessage } from "app/store/fuse/messageSlice"
//MUI
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Grid, InputLabel, MenuItem, FormControl, Box,
    Typography, Select
} from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
//COMPONENTS
import InputField from "../CustomField/InputField"
import DateField from "../CustomField/DateField"
import NumberFormat from 'react-number-format';
import AutocompleteField from './../CustomField/Autocomplete'
// API
import { storage } from "../../services/firebaseService/fireBase"
import candidatesAPI from 'api/candidatesAPI';
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
    const position = useSelector(state => state.fuse.tickets.position)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")))
    const [ticket, setTicket] = useState(item)
    const [tickets, setTickets] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [fileName, setFileName] = useState("")
    const [isFileEmpty, setIsFileEmpty] = useState(false)
    const [source, setSource] = useState(null)
    const arraySource = ticket != "" ? JSON.parse(ticket.Pheduyet)[3].CPTD.map(item => item.Nguon) : []
    useEffect(async () => {
        //GET THE CURRENT TICKETS
        const tickets = dataTicket.filter(item => item.Trangthai == 2)
        setTickets(tickets)
    }, [])
    const getPositionById = (id) => {
        return position.find(item => item.id == id)?.Thuoctinh
    }
    const form = useForm({
        defaultValues: {
            Hoten: "",
            Email: "",
            SDT: "",
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const isValid = form.formState.isValid && fileName !== "" && source != null
    const handleCreateCandidate = async (e) => {
        const profile = {
            Hoten: e.Hoten,
            Email: e.Email,
            Phone: e.SDT,
            CV: fileName,
            Nguon: source,
            NgayUT: new Date(selectedDate).toISOString(),
        }
        const bodyData = {
            idTicket: ticket.key,
            Profile: JSON.stringify(profile),
            LichPV: JSON.stringify({}),
            XacnhanHS: JSON.stringify({ Duyet: 0 }),
            idTao: user.profile.id
        }
        const response = await candidatesAPI.postCandidate(bodyData)
        dispatch(addCandidate(response.data))
        handleClose();
    }
    const handleUploadFile = (e) => {
        const file = e.target.files[0]
        const uploadFile = storage.ref(`files/${file.name}`).put(file);
        uploadFile.on("state_changed", (snapshot) => {
        },
            (error) => console.log(error),
            () => {
                storage.ref("files").child(file.name).getDownloadURL().then((url) => {
                    setFileName(url)
                })
            })
    }
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'lg'}
        >
            <DialogTitle id="alert-dialog-title" style={{ width: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>Tạo hồ sơ ứng viên</DialogTitle>
            <form onSubmit={form.handleSubmit(handleCreateCandidate)}>
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
                                label="CV"
                                type="file"
                                error={isFileEmpty}
                                helperText={isFileEmpty ? "Vui lòng nhập CV ứng viên" : ""}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                onChange={handleUploadFile}
                                fullWidth
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
