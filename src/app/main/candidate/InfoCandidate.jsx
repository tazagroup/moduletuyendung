import React, { useState, useEffect, Fragment } from 'react'
import { useSelector } from "react-redux"
import { makeStyles, TextField } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, FormControl } from '@mui/material';
import { Grid, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import InputField from "app/main/CustomField/InputField"
import DateField from '../CustomField/DateField';
import NumberFormat from "react-number-format"
import AutocompleteObjField from "../CustomField/AutocompleteObj"
import CardCalendar from "./CardCalendar"
import CreateCalendar from "./CreateCalendar"
import { CustomCV } from './CustomCell'
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
const InfoCandidate = ({ item, open, handleClose }) => {
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
    //STATE
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const [tickets, setTickets] = useState([])
    const [ticket, setTicket] = useState({})
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isCreating, setIsCreating] = useState(false)
    useEffect(async () => {
        //GET THE CURRENT TICKETS
        const tickets = dataTicket.filter(item => item.Tinhtrang === "Đã thanh toán")
        const flag = tickets.find(option => option.key === item.idTicket)
        //set selected ticket
        setTicket(flag)
        setTickets(tickets)
    }, [])
    const handleTicketChange = (e, newValue) => {
        setTicket(newValue)
    }
    const handleEditCandidate = (e) => {
        // Upload Candidate
        console.log(e)
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
                            <Grid item xs={12} md={4}>
                                <AutocompleteObjField label="Vị trí tuyển dụng" value={ticket} arrayItem={tickets} field="Vitri" handleChange={handleTicketChange} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <DateField label="Ngày ứng tuyển" value={selectedDate} handleChange={setSelectedDate} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <NumberFormat
                                    label={"Mức lương dự kiến"}
                                    customInput={TextField}
                                    thousandSeparator
                                    value={ticket?.LuongDK || ''}
                                    allowLeadingZeros={false}
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={12} md>
                                <FormControl fullWidth style={{ marginTop: "20px" }}>
                                    <Tooltip title="CV">
                                        <Button variant="contained">Tải CV</Button>
                                    </Tooltip>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {/* Calendar */}
                        <Grid container spacing={2} className={classes.field}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title}>
                                    Lịch phỏng vấn
                                    <IconButton size="large" onClick={() => { setIsCreating(true) }} >
                                        <InsertInvitationIcon />
                                    </IconButton>
                                </Typography>
                            </Grid>
                            {item.LichPV.map((option,index) => (
                                <Grid  key={index} item xs={12} md={3}>
                                    <CardCalendar key={index} item={option} />
                                </Grid>
                            ))}
                        </Grid >
                    </DialogContent>
                    <DialogActions>
                        <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" variant="contained">
                            Cập nhật hồ sơ
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            {isCreating && <CreateCalendar open={isCreating} candidate={item} handleClose={() => { setIsCreating(false) }} />}
        </Fragment>
    )
}

export default InfoCandidate
