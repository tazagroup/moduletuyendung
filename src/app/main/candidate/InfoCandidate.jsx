import React, { useState, Fragment } from 'react'
import { TextField, makeStyles } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputField from "app/main/CustomField/InputField"
import CardCalendar from "./CardCalendar"
import CreateCalendar from "./CreateCalendar"
import axios from 'axios';
//FORM
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
const schema = yup.object().shape({
    Hoten: yup.string().required("Vui lòng nhập tên ứng viên"),
    Email: yup.string().email("Vui lòng nhập đúng định dạng").required("Vui lòng nhập tên ứng viên"),
    SDT: yup.number().required("Vui lòng nhập tên ứng viên"),
});
const useStyles = makeStyles({
    field: {
        marginTop: "15px !important"
    },
    title: {
        width: "100%",
        textAlign: "center",
        fontSize: "25px !important",
        fontWeight: "bold !important"
    },
    icon: {
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    },
    sub__title: {
        fontWeight: "bold !important"
    }
})
const InfoCandidate = ({ item, open, handleClose, setIsFetching }) => {
    const classes = useStyles()
    const form = useForm({
        defaultValues: {
            Hoten: item.Hoten,
            Email: item.Email,
            SDT: item.SDT,
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const [isCreating, setIsCreating] = useState(false)
    const handleEditCandidate = (e) => {
        // Upload Candidate 
    }
    return (
        <Fragment>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <form onSubmit={form.handleSubmit(handleEditCandidate)}>
                    <DialogTitle id="alert-dialog-title" className={classes.title}>Hồ sơ ứng viên </DialogTitle>
                    <CloseIcon className={classes.icon} onClick={handleClose} />
                    <DialogContent>
                        {/* Info  */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title}>Thông tin cơ bản</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField form={form} name="Hoten" label="Họ tên ứng viên" type="text" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField form={form} name="Email" label="Email" type="text" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField form={form} name="SDT" label="Số điện thoại" type="number" />
                            </Grid>
                        </Grid>
                        {/* Calendar */}
                        <Grid container spacing={2} className={classes.field}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title}>
                                    Lịch phỏng vấn
                                    <IconButton size="large">
                                        <InsertInvitationIcon onClick={() => { setIsCreating(true) }} />
                                    </IconButton>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <CardCalendar />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <CardCalendar />
                            </Grid>
                        </Grid >
                        {/* Interview  */}
                        <Grid container spacing={2} className={classes.field}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title}>Vòng phỏng vấn</Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </form>
            </Dialog>
            {isCreating && <CreateCalendar open={isCreating} handleClose={() => { setIsCreating(false) }} />}
        </Fragment>
    )
}

export default InfoCandidate
