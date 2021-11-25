import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid, InputLabel } from '@mui/material';
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
import { yupResolver } from "@hookform/resolvers/yup"

import * as yup from "yup"
const schema = yup.object().shape({
    Nguon: yup.string().required(),
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

const ModalUpdateItem = ({ data, censor, setIsFetching }) => {
    const dispatch = useDispatch();
    const classes = useStyles()
    const [value, setValue] = useState('')
    const [source, setSource] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedDate2, setSelectedDate2] = useState(new Date())
    const [type, setType] = useState('')
    const [currency, setCurrency] = useState('')
    const [isValueEmpty, setIsValueEmpty] = useState(false)
    const reasons = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const disabledButton = (source == "" || type == "" || currency == "" ? true : false)
    //UPDATE TICKETS
    const handleUpdateTickets = async (e) => {
        const CPMua = currency.split(',').join('').split('đ')[0]
        const bodyData = {
            ...data,
            Nguon: source,
            TGMua: selectedDate.toISOString(),
            Chiphi: CPMua,
            Hinhthuc: type,
            Tinhtrang: 0,
            NTC: selectedDate2.toISOString()
        }
        const response = await axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets/${data.key}`, bodyData)
        setIsFetching(state => !state)
        dispatch(closeDialog())
    }
    return (
        <React.Fragment >
            <DialogTitle id="alert-dialog-title" className={classes.title}>Phiếu yêu cầu tuyển dụng
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            defaultValue={data.Vitri}
                            disabled={true}
                            id="demo-helper-text-aligned"
                            label="Vị trí tuyển dụng"
                            fullWidth
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Nhân sự hiện có"
                            defaultValue={data.SLHientai}
                            disabled={true}
                            type="number"
                            fullWidth
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Nhân sự cần tuyển"
                            defaultValue={data.SLCantuyen}
                            disabled={true}
                            type="number"
                            fullWidth
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <NumberFormat customInput={TextField}
                            label="Mức lương dự kiến"
                            variant="standard"
                            thousandSeparator={true}
                            value={data.LuongDK}
                            disabled={true}
                            autoComplete="off"
                            suffix="đ"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            defaultValue={reasons.includes(data.Lydo) ? data.Lydo : "Khác"}
                            disabled={true}
                            id="demo-helper-text-aligned"
                            label="Lí do tuyển dụng"
                            fullWidth
                            variant="standard"
                        />
                    </Grid>
                    {!reasons.includes(data.Lydo) &&
                        <Grid item xs={12}>
                            <TextField
                                id="demo-helper-text-aligned"
                                label="Lý do khác"
                                defaultValue={data.Lydo}
                                disabled={true}
                                type="text"
                                fullWidth
                                variant="standard" />
                        </Grid>
                    }
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                views={['year', 'month', 'day']}
                                label="Thời gian thử việc"
                                value={data.TGThuviec}
                                disabled={true}
                                onChange={(newValue) => {
                                    setValue(newValue);
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
                                value={data.TiepnhanNS}
                                disabled={true}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Mô tả tuyển dụng"
                            type="text"
                            defaultValue={data.MotaTD}
                            disabled={true}
                            fullWidth
                            variant="standard"
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextareaAutosize
                        aria-label="empty textarea"
                        placeholder="Yêu cầu tuyển dụng"
                        defaultValue={data.YeucauTD}
                        disabled={true}
                        className={classes.textarea}
                    />
                </Grid>
                <TextField
                    id="demo-helper-text-aligned"
                    label="Người kiểm duyệt"
                    type="text"
                    defaultValue={censor}
                    disabled={true}
                    fullWidth
                    variant="standard"
                />
                <Grid container spacing={2}>
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
                                    value={selectedDate}
                                    onChange={(newValue) => {
                                        setSelectedDate(newValue);
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
                            value={currency}
                            error={isValueEmpty}
                            helperText={isValueEmpty ? "Vui lòng nhập chi phí" : ""}
                            onBlur={(e) => { setIsValueEmpty(e.target.defaultValue == "") }}
                            onChange={(e) => { setCurrency(e.target.value) }}
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
                                value={type}
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
                                    value={selectedDate2}
                                    onChange={(newValue) => {
                                        setSelectedDate2(newValue);
                                    }}
                                    inputFormat="dd/MM/yyyy"
                                    renderInput={(params) => <TextField {...params} fullWidth
                                    />}

                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" autoFocus type="submit" variant="contained" disabled={disabledButton} onClick={handleUpdateTickets}>
                    Cập nhật tuyển dụng
                </Button>
            </DialogActions>
        </React.Fragment >
    );
}

export default ModalUpdateItem
