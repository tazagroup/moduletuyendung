import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import NumberFormat from 'react-number-format';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';
//FORM
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
const schema = yup.object().shape({
    Vitri: yup.string().required(),
    SLHientai: yup.number().required(),
    SLCantuyen: yup.number().required(),
    MotaTD: yup.string().required(),
    YeucauTD: yup.string().required(),
});
const useStyles = makeStyles({
    title: {
        width: "100%",
        textAlign: "center",
        fontSize: "20px !important",
        fontWeight: "bold !important"
    },
    field: {
        marginTop: "15px !important"
    },
    textarea: {
        width: "100%",
        margin: "10px 0",
        padding: "10px",
        paddingLeft: "0px",
        borderBottom: "1px solid #bbbec4",
        fontSize: "19px"
    },
    icon: {
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    },
    gridLeft: {
        paddingRight: "8px"
    },
    gridRight: {
        paddingLeft: "8px"
    }
})
const reasons = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực"]
const ModalEditItem = ({ item, open, handleClose, setIsFetching }) => {
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(item.TGThuviec)
    const [selectedDate2, setSelectedDate2] = useState(item.TiepnhanNS)
    const [selectedDate3, setSelectedDate3] = useState(item.TGMua ? item.TGMua : "")
    const [selectedDate4, setSelectedDate4] = useState(item.NTC ? item.NTC : "")
    const [currency, setCurrency] = useState(item.LuongDK)
    const [currency2, setCurrency2] = useState(item.Chiphi ? item.Chiphi : "")
    const [isValueEmpty, setIsValueEmpty] = useState(false)
    const [isOther, setIsOther] = useState(false)
    const [reason, setReason] = useState(reasons.includes(item.Lydo) ? item.Lydo : "Khác")
    const [otherReason, setOtherReason] = useState(!reasons.includes(item.Lydo) ? item.Lydo : "")
    const [source, setSource] = useState(item.Nguon ? item.Nguon : "")
    const [type, setType] = useState(item.Hinhthuc !== "" ? item.Hinhthuc : "")
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const { Vitri, SLHientai, SLCantuyen, MotaTD, YeucauTD } = errors
    const reasonCondition = isOther ? otherReason == "" : reason == ""
    const disabledButton = (Vitri || SLHientai || SLCantuyen || MotaTD || YeucauTD || currency == "" || reasonCondition || type === "" || currency2 == "" || source == "") ? true : false
    const handleEditTicket = async (e) => {
        const LuongDK = currency.split(',').join('').split('đ')[0]
        const Chiphi = currency2.split(',').join('').split('đ')[0]
        const bodyData = {
            Vitri: e.Vitri,
            SLHientai: e.SLHientai,
            SLCantuyen: e.SLCantuyen,
            TGThuviec: selectedDate,
            TiepnhanNS: selectedDate2,
            Lydo: otherReason ? otherReason : reason,
            MotaTD: e.MotaTD,
            YeucauTD: e.YeucauTD,
            Pheduyet: item.Pheduyet,
            idTao: item.idTao,
            LuongDK: LuongDK,
            Nguon: source,
            TGMua: selectedDate3,
            Chiphi: Chiphi,
            Hinhthuc: type,
            Tinhtrang: item.Tinhtrang,
            NTC: selectedDate4
        }
        await axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets/${item.key}`, bodyData)
        setIsFetching(state => !state)
        handleClose()
    }
    return (
        <React.Fragment >
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <form onSubmit={handleSubmit(handleEditTicket)}>
                    <DialogTitle id="alert-dialog-title" className={classes.title}>Phiếu yêu cầu tuyển dụng
                    </DialogTitle>
                    <CloseIcon className={classes.icon} onClick={handleClose} />
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={Vitri ? true : false}
                                    helperText={Vitri ? "Vui lòng điền vị trí tuyển dụng" : ""}
                                    id="demo-helper-text-aligned"
                                    label="Vị trí tuyển dụng"
                                    fullWidth
                                    variant="standard"
                                    defaultValue={item.Vitri}
                                    {...register("Vitri")}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    id="demo-helper-text-aligned"
                                    error={SLHientai ? true : false}
                                    helperText={SLHientai ? "Vui lòng điền nhân sự hiện có" : ""}
                                    label="Nhân sự hiện có"
                                    defaultValue={item.SLHientai}
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    {...register("SLHientai")}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    id="demo-helper-text-aligned"
                                    error={SLCantuyen ? true : false}
                                    helperText={SLCantuyen ? "Vui lòng điền nhân sự cần tuyển" : ""}
                                    label="Nhân sự cần tuyển"
                                    defaultValue={item.SLCantuyen}
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    {...register("SLCantuyen")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <NumberFormat customInput={TextField}
                                    label="Mức lương dự kiến"
                                    variant="standard"
                                    thousandSeparator={true}
                                    value={currency}
                                    error={isValueEmpty}
                                    helperText={isValueEmpty ? "Vui lòng nhập mức lương" : ""}
                                    onChange={e => setCurrency(e.target.value)}
                                    onBlur={(e) => { setIsValueEmpty(e.target.defaultValue == "") }}
                                    autoComplete="off"
                                    suffix="đ"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="demo-customized-textbox" style={{ fontSize: "1em", fontWeight: "500", paddingBottom: "4px" }}>Lí do tuyển dụng</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={reason}
                                        onChange={e => {
                                            setReason(e.target.value)
                                            if (e.target.value === "Khác") {
                                                setIsOther(true)
                                            }
                                        }}
                                        label="Lí do tuyển dụng"
                                        placeholder="Lí do tuyển dụng"
                                        MenuProps={{ disablePortal: true }}
                                        style={{ lineHeight: "28px", fontSize: "19px" }}
                                    >
                                        <MenuItem value={"Tuyển mới"}>Tuyển mới</MenuItem>
                                        <MenuItem value={"Thay thế"}>Thay thế</MenuItem>
                                        <MenuItem value={"Dự phòng nhân lực"}>Dự phòng nhân lực</MenuItem>
                                        <MenuItem value={"Khác"}>Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {!reasons.includes(item.Lydo) &&
                                <Grid item xs={12}>
                                    <TextField
                                        id="demo-helper-text-aligned"
                                        label="Lý do khác"
                                        type="text"
                                        defaultValue={otherReason}
                                        onChange={(e) => { setOtherReason(e.target.value) }}
                                        fullWidth
                                        variant="standard" />
                                </Grid>
                            }
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        views={['year', 'month', 'day']}
                                        label="Thời gian thử việc"
                                        value={selectedDate}
                                        onChange={(newValue) => {
                                            setSelectedDate(newValue.toISOString());
                                        }}
                                        inputFormat="dd/MM/yyyy"
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        views={['year', 'month', 'day']}
                                        label="Thời gian tiếp nhận"
                                        inputFormat="dd/MM/yyyy"
                                        value={selectedDate2}
                                        onChange={(newValue) => {
                                            setSelectedDate2(newValue.toISOString());
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={MotaTD ? true : false}
                                    helperText={MotaTD ? "Vui lòng nhập mô tả" : ""}
                                    id="demo-helper-text-aligned"
                                    label="Mô tả tuyển dụng"
                                    defaultValue={item.MotaTD}
                                    fullWidth
                                    type="text"
                                    variant="standard"
                                    {...register("MotaTD")}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Yêu cầu tuyển dụng"
                                defaultValue={item.YeucauTD}
                                className={classes.textarea}
                                {...register("YeucauTD")}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} className={classes.gridLeft}>
                            {/* Nguồn mua  */}
                            <FormControl variant="standard" fullWidth className={classes.field}>
                                <InputLabel htmlFor="demo-customized-textbox" style={{ fontSize: "1em", fontWeight: "500" }}>Nguồn</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={source}
                                    onChange={(e) => { setSource(e.target.value) }}
                                    label="Nguồn"
                                    disabled={source == "" ? true : false}
                                    placeholder="Nguồn"
                                    MenuProps={{ disablePortal: true }}
                                    style={{ fontSize: "19px" }}
                                >
                                    <MenuItem value={"Facebook"}>Facebook</MenuItem>
                                    <MenuItem value={"TopCV"}>TopCV</MenuItem>
                                    <MenuItem value={"ITViec"}>ITViec</MenuItem>
                                </Select>
                            </FormControl>
                            {/* Thời gian mua */}
                            <FormControl variant="standard" fullWidth className={classes.field}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        views={['year', 'month', 'day']}
                                        label="Thời gian mua"
                                        value={selectedDate3}
                                        disabled={selectedDate3 == "" ? true : false}
                                        onChange={(newValue) => {
                                            setSelectedDate3(newValue.toISOString());
                                        }}
                                        inputFormat="dd/MM/yyyy"
                                        renderInput={(params) => <TextField {...params} fullWidth
                                        />}

                                    />
                                </LocalizationProvider>
                            </FormControl>
                            {/* Chi phí mua  */}
                            <NumberFormat customInput={TextField}
                                label="Chi phí"
                                variant="standard"
                                thousandSeparator={true}
                                value={currency2}
                                error={isValueEmpty}
                                disabled={currency2 == "" ? true : false}
                                helperText={isValueEmpty ? "Vui lòng nhập chi phí" : ""}
                                onBlur={(e) => { setIsValueEmpty(e.target.defaultValue == "") }}
                                onChange={(e) => { setCurrency2(e.target.value) }}
                                autoComplete="off"
                                suffix="đ"
                                fullWidth
                                style={{ marginTop: "15px" }}
                            />
                            <FormControl variant="standard" fullWidth className={classes.field}>
                                <InputLabel htmlFor="demo-customized-textbox" style={{ fontSize: "1em", fontWeight: "500" }}>Hình thức thanh toán</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    defaultValue={type}
                                    onChange={(e) => { setType(e.target.value) }}
                                    label="Hình thức thanh toán"
                                    placeholder="Hình thức thanh toán"
                                    MenuProps={{ disablePortal: true }}
                                    style={{ fontSize: "19px" }}
                                >
                                    <MenuItem value={0}>Chuyển khoản</MenuItem>
                                    <MenuItem value={1}>Thanh toán tiền mặt</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" fullWidth className={classes.field}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        views={['year', 'month', 'day']}
                                        label="Ngày cần thanh toán"
                                        value={selectedDate4}
                                        onChange={(newValue) => {
                                            setSelectedDate4(newValue.toISOString());
                                        }}
                                        inputFormat="dd/MM/yyyy"
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" autoFocus type="submit" variant="contained" disabled={disabledButton}>
                            Cập nhật tuyển dụng
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    )
}

export default ModalEditItem
