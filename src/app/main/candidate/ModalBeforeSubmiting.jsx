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

const ModalBeforeSubmitting = ({ open, handleClose, item }) => {
    const form = useForm({
        defaultValues: {
            LuongHV: " ",
            LuongTV: " ",
            LuongCT: " ",
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const position = useSelector(state => state.fuse.tickets.position)
    const profile = JSON.parse(item.Profile)
    const dispatch = useDispatch()
    const classes = useStyles()
    //STATE
    const [ticket, setTicket] = useState({})
    const [selectedDate, setSelectedDate] = useState(new Date())
    const calendar = JSON.parse(item.LichPV)
    const [firstRate, setFirstRate] = useState(calendar?.Danhgia || '')
    const [secondRate, setSecondRate] = useState('')
    const [point, setPoint] = useState(calendar?.Diem || 0)
    const [note, setNote] = useState(calendar?.Ghichu || '')
    const [status, setStatus] = useState(calendar?.Trangthai || 0)
    const roundsIntern = calendar.VongPV
    const secondStep = roundsIntern ? roundsIntern[1]?.Trangthai == 1 : false
    //FUNCTIONS
    const getPositionById = (id) => {
        return position.find(item => item.id == id)?.Thuoctinh
    }

    const handleUpdateInfo = async (e) => {
        console.log(e)
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
                                <FormControl fullWidth style={{ marginTop: "15px" }}>
                                    <Tooltip title="CV">
                                        <Button variant="contained" size="large">Tải CV</Button>
                                    </Tooltip>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {/* Calendar */}
                        {/* <Grid container spacing={2} className={classes.field}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title}>
                                    Lịch phỏng vấn
                                    <IconButton size="large" onClick={() => { setIsCreating(true) }} disabled={true}>
                                        <InsertInvitationIcon />
                                    </IconButton>
                                </Typography>
                            </Grid>
                            {roundsIntern && roundsIntern.map((option, index) => (
                                <Grid key={index} item xs={12} md={3}>
                                    <CardCalendar key={index} item={option} />
                                </Grid>
                            ))}
                        </Grid >
                        {secondStep &&
                            <>
                                <Grid container spacing={2} className={classes.field}>
                                    <Grid item xs={12}>
                                        <Typography variant="h4" className={classes.sub__title} style={{ marginBottom: "16px" }} >Nhận xét phỏng vấn</Typography>
                                        <Tinymce value={firstRate} onChange={(e) => { setFirstRate(e) }} label="đánh giá kiến thức" disabled={true} />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className={classes.field2}>
                                    <Grid item xs={12} md={8}>
                                        <FormControl variant="standard" fullWidth style={{ marginTop: "18px" }}>
                                            <InputLabel htmlFor="component-simple">Ghi chú</InputLabel>
                                            <Input id="component-simple" value={note} onChange={(e) => { setNote(e.target.value) }} disabled={true} />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item xs={4}>
                                        <Grid item xs={12} md={8}>
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginTop: "24px"
                                                }}
                                            >
                                                <Rating
                                                    name="text-feedback"
                                                    value={point}
                                                    max={10}
                                                    precision={0.5}
                                                    size="large"
                                                    disabled={true}
                                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                    onChange={(e) => { setPoint(Number(e.target.value)) }}
                                                />
                                                <Box sx={{ ml: 2 }}>{point}</Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth style={{ marginTop: "10px" }}>
                                                <InputLabel id="demo-simple-select-label">Đánh giá hồ sơ</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={status}
                                                    label="Đánh giá hồ sơ"
                                                    style={{ fontSize: "15px" }}
                                                    onChange={(e) => { setStatus(e.target.value) }}
                                                    disabled={true}
                                                >
                                                    <MenuItem value={0} disabled></MenuItem>
                                                    <MenuItem value={1}>Đậu</MenuItem>
                                                    <MenuItem value={2}>Loại</MenuItem>
                                                    <MenuItem value={3}>Lưu hồ sơ</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        } */}
                        <Grid container spacing={2} className={classes.field2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title} style={{ marginBottom: "16px" }} >Nhận xét chung</Typography>
                                <Tinymce value={secondRate} onChange={(e) => { setSecondRate(e) }} label="nhận xét chung" />
                            </Grid>
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
                        <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose} size="large">
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" variant="contained" size="large">
                            Xác nhận
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Fragment>
    )
}

export default ModalBeforeSubmitting
