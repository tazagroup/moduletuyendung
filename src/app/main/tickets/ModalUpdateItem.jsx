import React, { useState } from 'react'
// REDUX 
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket } from "app/store/fuse/ticketsSlice"
import { closeDialog } from 'app/store/fuse/dialogSlice';
//MUI
import { DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import NumberFormat from 'react-number-format';
import MenuItem from '@mui/material/MenuItem';
// REACT-HOOK-FORM
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
//COMPONENT
import InputField from '../CustomField/InputField';
import NumberField from '../CustomField/NumberField'
import SelectField from "../CustomField/SelectField"
import DateField from "../CustomField/DateField"
import Tinymce from "../CustomField/Tinymce"
// API
import axios from 'axios';
import ticketsAPI from "api/ticketsAPI"
const useStyles = makeStyles({
    title: {
        width: "100%",
        textAlign: "center",
        fontSize: "25px !important",
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
const ModalUpdateItem = ({ data, censor }) => {
    const dispatch = useDispatch();
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const position = useSelector(state => state.fuse.tickets.position)
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
        const item = dataTicket.find(item => item.key === data.key)
        const step = JSON.parse(item['Pheduyet'])
        step[1] = {
            ...step[1],
            Nguon: source,
            TGMua: selectedDate.toISOString(),
            Chiphi: e.Chiphi.split(',').join(''),
            Hinhthuc: type,
            NTC: selectedDate2.toISOString()
        }
        const bodyData = {
            TNNS: JSON.stringify({ nguoiDuyet: "User", ngayDuyet: new Date().toISOString() }),
            Pheduyet: JSON.stringify([...step])
        }
        const response = await ticketsAPI.updateTicket(bodyData, item.key)
        dispatch(updateTicket(response.data))
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
                            <TextInputCustom value={position.find(item => item.id == data.Vitri)?.Thuoctinh} label="Vị trí tuyển dụng" type="text" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextInputCustom value={data.SLHT} label="Nhân sự hiện có" type="number" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextInputCustom value={data.SLCT} label="Nhân sự cần tuyển" type="number" />
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
                        <Grid item xs={12} md={12}>
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
