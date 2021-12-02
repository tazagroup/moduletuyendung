import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Grid, InputLabel, MenuItem, FormControl, Box,
    Typography, Select
} from '@mui/material';
import { useDispatch, useSelector } from "react-redux"
import { showMessage } from "app/store/fuse/messageSlice"
import { TextField, makeStyles } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import InputField from "../CustomField/InputField"
import SelectField from "../CustomField/SelectField"
import DateField from "../CustomField/DateField"
import { storage } from "../../services/firebaseService/fireBase"
import axios from "axios"
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
    const [ticket, setTicket] = useState(item)
    const [tickets, setTickets] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [fileName, setFileName] = useState("")
    const [isFileEmpty, setIsFileEmpty] = useState(false)
    useEffect(async () => {
        //GET THE CURRENT TICKETS
        const tickets = dataTicket.filter(item => item.Tinhtrang === "Đã thanh toán")
        setTickets(tickets)
    }, [])
    const form = useForm({
        defaultValues: {
            Vitri: ticket.Vitri || "",
            Nguon: ticket.Nguon || "",
            Hoten: "",
            Email: "",
            SDT: "",
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const isValid = form.formState.isValid && fileName !== ""
    const handleCreateCandidate = async (e) => {
        const bodyData = {
            ...e,
            idTicket: ticket.key,
            CV: fileName,
            DuyetCV: 0,
            MoiPV: null,
            NgayUT: selectedDate.toISOString(),
            NgayTao: new Date().toISOString()
        }
        if (fileName === "") { setIsFileEmpty(true) }
        else {
            const response = await axios.post(`https://6195d82474c1bd00176c6ede.mockapi.io/Candidate`, bodyData)
            if (response.data) {
                dispatch(showMessage({
                    message: 'Tạo hồ sơ thành công',
                    autoHideDuration: 2000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    variant: 'success'
                }))
                handleClose()
            }
        }


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
            <CloseIcon className={classes.icon} onClick={handleClose} />
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
                                        return (value && Object.keys(value).length !== 0) ? <div>Phiếu {value.key} - {value.Vitri}</div> : <div></div>
                                    }}
                                    onChange={(e) => setTicket(e.target.value)}
                                >
                                    {tickets.map(item => (
                                        <MenuItem key={item.key} value={item} className="menu__item">Phiếu {item.key} - {item.Vitri}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="Vitri"
                                control={form.control}
                                render={(props) => {
                                    const { invalid, error } = props.fieldState;
                                    return (
                                        <TextField
                                            {...props.field}
                                            error={invalid}
                                            helperText={error?.message}
                                            label={"Vị trí tuyển dụng"}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            value={ticket.Vitri}
                                            variant="standard"
                                            disabled={true}
                                        />
                                    );
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="Nguon"
                                control={form.control}
                                render={(props) => {
                                    const { invalid, error } = props.fieldState;
                                    return (
                                        <TextField
                                            {...props.field}
                                            error={invalid}
                                            helperText={error?.message}
                                            label={"Nguồn ứng tuyển"}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            value={ticket.Nguon}
                                            variant="standard"
                                            disabled={true}
                                        />
                                    );
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InputField form={form} name="Hoten" label={"Họ tên ứng viên"} type="text" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InputField form={form} name="Email" label={"Email"} type="text" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <InputField form={form} name="SDT" label={"Phone"} type="number" />
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
                    <Button color="primary" autoFocus type="submit" disabled={!isValid} variant="contained">
                        Tạo hồ sơ
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateCandidate
