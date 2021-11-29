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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import InputField from '../CustomField/InputField';
import NumberField from '../CustomField/NumberField'
import SelectField from "../CustomField/SelectField"
import DateField from "../CustomField/DateField"
import Tinymce from "../CustomField/Tinymce"
import axios from 'axios';

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
        fontSize: "15px"
    },
    icon: {
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    },
    gridLeft: {
        paddingRight: "8px",
        marginTop: "15px !important"
    },
})
const schema = yup.object().shape({
    Chiphi: yup.string().required("Vui lòng nhập chi phí"),
    Tinhtrang: yup.string().default("Chưa thanh toán"),
})

const TextInputCustom = (props) => {
    const { value, label, type } = props
    return (
        <TextField
            defaultValue={value}
            disabled={true}
            id="demo-helper-text-aligned"
            label={label}
            fullWidth
            variant="standard"
            type={type}
        />
    )
}
const ModalUpdateItem = ({ data, censor, setIsFetching }) => {
    const dispatch = useDispatch();
    const classes = useStyles()
    const form = useForm({
        defaultValues: {
            Chiphi: "",
            Tinhtrang: "Chưa thanh toán"
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const [value, setValue] = useState('')
    const [source, setSource] = useState('')
    const sourceArray = ["Facebook", "TopCV", "ITViec"]
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedDate2, setSelectedDate2] = useState(new Date())
    const [type, setType] = useState('')
    const typeArray = ["Chuyển khoản", "Thanh toán tiền mặt"]
    const reasons = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
    const isValid = form.formState.isValid
    //UPDATE TICKETS
    const handleUpdateTickets = async (e) => {
        const bodyData = {
            ...data,
            Nguon: source,
            TGMua: selectedDate.toISOString(),
            Chiphi: e.Chiphi.split(',').join(''),
            Hinhthuc: type,
            Tinhtrang: e.Tinhtrang,
            NTC: selectedDate2.toISOString()
        }
        const response = await axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets/${data.key}`, bodyData)
        setIsFetching(state => !state)
        dispatch(closeDialog())
    }
    return (
        <React.Fragment >
            <form onSubmit={form.handleSubmit(handleUpdateTickets)}>
                <DialogTitle id="alert-dialog-title" className={classes.title}>Phiếu yêu cầu tuyển dụng
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextInputCustom value={data.Vitri} label="Vị trí tuyển dụng" type="text" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextInputCustom value={data.SLHientai} label="Nhân sự hiện có" type="number" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextInputCustom value={data.SLCantuyen} label="Nhân sự cần tuyển" type="number" />
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
                            <TextInputCustom value={reasons.includes(data.Lydo) ? data.Lydo : "Khác"} label="Lí do tuyển dụng" type="text" />
                        </Grid>
                        {!reasons.includes(data.Lydo) &&
                            <Grid item xs={12}>
                                <TextInputCustom value={data.Lydo} label="Lí do khác" type="text" />
                            </Grid>
                        }
                        {/* Thời gian thử việc  */}
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
                        {/* Thời gian tiếp nhận */}
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
                        {/* Mô tả tuyển dụng  */}
                        <Grid item xs={12}>
                            <TextInputCustom value={data.MotaTD} label="Mô tả tuyển dụng" type="text" />
                        </Grid>
                        {/* Yêu cầu tuyển dụng  */}
                        <Grid item xs={12}>
                            <TextInputCustom value={data.YeucauTD} label="Yêu cầu tuyển dụng" type="text" />
                        </Grid>
                        {/* Người kiểm duyệt  */}
                        <Grid item xs={12}>
                            <TextInputCustom value={censor} label="Người kiểm duyệt" type="text" />
                        </Grid>
                        {/* Nguồn mua  */}
                        <Grid item xs={12}>
                            <SelectField label="Nguồn mua" value={source} arrayItem={sourceArray} handleChange={(e) => { setSource(e.target.value) }} />
                        </Grid>
                        {/* Thời gian mua  */}
                        <Grid item xs={12}>
                            <DateField label="Thời gian mua" value={selectedDate} handleChange={setSelectedDate} />
                        </Grid>
                        {/* Chi phí mua  */}
                        <Grid item xs={12}>
                            <NumberField form={form} name="Chiphi" label="Chi phí" error="Vui lòng nhập chi phí" />
                        </Grid>
                        {/* Hình thức thanh toán  */}
                        <Grid item xs={12}>
                            <SelectField label="Hình thức thanh toán" value={type} arrayItem={typeArray} handleChange={(e) => { setType(e.target.value) }} />
                        </Grid>
                        {/* Ngày cần thanh toán  */}
                        <Grid item xs={12}>
                            <DateField label="Ngày cần thanh toán" value={selectedDate2} handleChange={setSelectedDate2} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" autoFocus type="submit" variant="contained" disabled={!isValid}>
                        Cập nhật tuyển dụng
                    </Button>
                </DialogActions>
            </form>
        </React.Fragment >
    );
}

export default ModalUpdateItem
