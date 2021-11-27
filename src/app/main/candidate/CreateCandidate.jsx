import React, { useState } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Grid, InputLabel, MenuItem, FormControl, Divider, Box,
    Typography, Select
} from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { storage } from "./../../services/firebaseService/fireBase"
const schema = yup.object().shape({
    Hoten: yup.string().required(),
});
const useStyles = makeStyles({
    field: {
        marginTop: "15px !important"
    },
    select: {
        fontSize: "20px !important"
    },
    label: {
        fontSize: "1.3rem !important"
    },
    icon: {
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    }
})
const CreateCandidate = ({ open, item, handleClose }) => {
    const classes = useStyles()
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const handleCreateCandidate = (e) => {

    }
    const handleUploadFile = (e) => {
        const file = e.target.files[0]
        const uploadFile = storage.ref(`files/${file.name}`).put(file);
        uploadFile.on("state_changed", (snapshot) => {
        },
            (error) => console.log(error),
            () => {
                storage.ref("files").child(file.name).getDownloadURL().then((url) => console.log(url))
            })
    }
    const handleFileChange = (e) => {
        console.log(e)
    }
    const [ticket, setTicket] = useState(item)
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'lg'}
        >
            <DialogTitle id="alert-dialog-title" style={{ width: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>Tạo hồ sơ ứng viên</DialogTitle>
            <CloseIcon className={classes.icon} onClick={handleClose} />
            <form onSubmit={handleSubmit(handleCreateCandidate)}>
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
                                    onChange={(e) => setTicket(e.target.value)}
                                >
                                    <MenuItem value={ticket}>Phiếu 1</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                id="outlined-read-only-input"
                                className={classes.field}
                                label="Vị trí tuyển dụng"
                                defaultValue={ticket.Vitri}
                                disabled={true}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Họ tên ứng viên"
                                fullWidth
                                {...register("Hoten")}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Email"
                                fullWidth
                                {...register("Email")}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Phone"
                                type="number"
                                fullWidth
                                {...register("sdt")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-read-only-input"
                                label="CV"
                                type="file"
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
                    <button>OK</button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateCandidate
