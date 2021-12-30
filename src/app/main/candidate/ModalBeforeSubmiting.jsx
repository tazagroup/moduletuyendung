import React, { useState, useEffect, Fragment } from 'react'
//REDUX
import { useSelector, useDispatch } from "react-redux"
import { updateCandidate } from "app/store/fuse/candidateSlice"
//MUI
import { makeStyles, TextField } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, FormControl, Typography, IconButton, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
//FORM
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
//COMPONENTS
import NumberField from '../CustomField/NumberField';
import DateField from '../CustomField/DateField';
import Tinymce from '../CustomField/Tinymce'
import NumberFormat from "react-number-format"
import CardCalendar from "./CardCalendar"
import CreateCalendar from "./CreateCalendar"
//API
import candidatesAPI from 'api/candidatesAPI'
const schema = yup.object().shape({
    LuongHV: yup.string().required("Vui lòng nhập mức lương học việc"),
    LuongTV: yup.string().required("Vui lòng nhập mức lương thử việc"),
    LuongCT: yup.string().required("Vui lòng nhập mức lương chính thức"),
});
const useStyles = makeStyles({
    field: {
        marginTop: "15px !important"
    },
    field2: {
        marginTop: "5px !important"
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

const ModalBeforeSubmitting = ({ open, handleClose, item, censor }) => {
    const form = useForm({
        defaultValues: {
            LuongHV: "",
            LuongTV: "",
            LuongCT: "",
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });
    const user = JSON.parse(localStorage.getItem("profile"))
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const currentEdit = useSelector(state => state.fuse.candidates.flagCandidate)
    const position = useSelector(state => state.fuse.tickets.position)
    const profile = JSON.parse(item.Profile)
    const dispatch = useDispatch()
    const classes = useStyles()
    //STATE
    const [ticket, setTicket] = useState(dataTicket.find(opt => opt.key == item.idTicket))
    const [selectedDate, setSelectedDate] = useState(new Date())
    const calendar = JSON.parse(item.LichPV)
    //FUNCTIONS
    const getPositionById = (id) => {
        const index = dataTicket.find(opt => opt.key == id).Vitri
        return position.find(item => item.id == index)?.Thuoctinh
    }
    const handleUpdateInfo = async (e) => {
        const DanhgiaHS = {
            LuongHV: e.LuongHV.split(",").join(''),
            LuongTV: e.LuongHV.split(",").join(''),
            LuongCT: e.LuongHV.split(",").join(''),
            GTM: new Date(selectedDate).toISOString(),
        }
        const bodyData = {
            ...currentEdit,
            DanhgiaHS: JSON.stringify(DanhgiaHS),
            DuyetHS: JSON.stringify({ DuyetSPV: { Trangthai: 1, Nguoiduyet: user.profile.id }, DuyetQL: { Trangthai: 0, Nguoiduyet: censor.id } })
        }
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        dispatch(updateCandidate(response.data))
        handleClose()
    }
    const CustomInput = ({ type, label, variant = "standard", disabled = true, value }) => {
        return (
            <TextField
                value={value}
                type={type}
                label={label}
                fullWidth
                InputLabelProps={{
                    shrink: true
                }}
                variant={variant}
                disabled={disabled}
            />
        )
    }
    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <form onSubmit={form.handleSubmit(handleUpdateInfo)}>
                    <DialogTitle id="alert-dialog-title" className={classes.title}>Hồ sơ ứng viên </DialogTitle>
                    <DialogContent>
                        {/* Info  */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title}>Thông tin cơ bản</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <CustomInput label="Họ tên ứng viên" type="text" value={profile.Hoten} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <CustomInput label="Email" type="text" value={profile.Email} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <CustomInput label="Số điện thoại" type="number" value={profile.Phone} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <CustomInput label="Vị trí tuyển dụng" type="text" value={getPositionById(item.idTicket)} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <DateField label="Ngày ứng tuyển" value={selectedDate} handleChange={setSelectedDate} disabled={true} />
                            </Grid>
                            <Grid item xs={12} md={4}>
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
                        </Grid>
                        <Grid container spacing={2} className={classes.field2}>
                            <Grid item xs={4}>
                                <NumberField form={form} name="LuongHV" label="Mức lương học việc" error="Vui lòng nhập mức lương học việc" />
                            </Grid>
                            <Grid item xs={4}>
                                <NumberField form={form} name="LuongTV" label="Mức lương thử việc" error="Vui lòng nhập mức lương thử việc" />
                            </Grid>
                            <Grid item xs={4}>
                                <NumberField form={form} name="LuongCT" label="Mức lương chính thức" error="Vui lòng nhập mức lương chính thức" />
                            </Grid>
                            <Grid item xs={12}>
                                <DateField label="Ngày gửi thư mời" value={selectedDate} handleChange={setSelectedDate} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ paddingRight: "25px" }}>
                        <Button color="error" autoFocus type="submit" variant="contained" size="large" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" variant="contained" size="large" disabled={!form.formState.isValid}>
                            Xác nhận
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Fragment>
    )
}

export default ModalBeforeSubmitting
