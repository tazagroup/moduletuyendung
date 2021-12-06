import React, { useState } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket } from 'app/store/fuse/ticketsSlice';
//MUI
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import NumberFormat from 'react-number-format';
//FORM
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
// COMPONENT 
import InputField from "../CustomField/InputField"
import DateField from '../CustomField/DateField';
import SelectField from "../CustomField/SelectField"
import NumberField from '../CustomField/NumberField';
import Tinymce from '../CustomField/Tinymce';
import AutocompleteObjField from '../CustomField/AutocompleteObj';
// API 
import ticketsAPI from "api/ticketsAPI"
const schema = yup.object().shape({
    LuongDK: yup.string().required("Vui lòng nhập lương dự kiến"),
    SLHT: yup.number().min(0, "Dữ liệu không đúng"),
    SLCT: yup.number().min(1, "Dữ liệu không đúng"),
    Mota: yup.string().required("Vui lòng nhập mô tả tuyển dụng"),
    Yeucau: yup.string().required("Vui lòng nhập yêu cầu tuyển dụng"),
});
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
        padding: "5px",
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
        paddingRight: "8px"
    },
    gridRight: {
        paddingLeft: "8px"
    }
})
const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực"]
const arraySource = ["Facebook", "ITViec", "TopCV"]
const arrayType = ["Thanh toán tiền mặt", "Chuyển khoản"]
const ModalEditItem = ({ item, open, handleClose }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const position = useSelector(state => state.fuse.tickets.position)
    const steps = JSON.parse(item['Pheduyet'])
    console.log(steps)
    const [valuePosition, setValuePosition] = useState(position.find(flag => flag.id === item.Vitri))
    const [selectedDate, setSelectedDate] = useState(item.TGThuviec)
    const [selectedDate3, setSelectedDate3] = useState(steps[1] ? steps[1].TGMua : null)
    const [selectedDate4, setSelectedDate4] = useState(steps[1] ? steps[1].NTC : null)
    const [reason, setReason] = useState(arrayReason.includes(item.Lydo) ? item.Lydo : "Khác")
    const [otherReason, setOtherReason] = useState(!arrayReason.includes(item.Lydo) ? item.Lydo : "")
    const [source, setSource] = useState(steps[1] ? steps[1].Nguon : "")
    const [currency, setCurrency] = useState(steps[1] ? steps[1].Chiphi : "")
    const [type, setType] = useState(steps[1] ? steps[1].Hinhthuc : "")
    const form = useForm({
        defaultValues: {
            SLCT: item.SLCT,
            SLHT: item.SLHT,
            Mota: item.Mota,
            Yeucau: item.Yeucau,
            LuongDK: item.LuongDK,
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const checkStep = steps.length <= 3

    const handleEditTicket = async (e) => {
        const flagPheduyet = [...JSON.parse(item['Pheduyet'])]
        if (flagPheduyet[2]) {
            flagPheduyet[1] = {
                ...flagPheduyet[1],
                Nguon: source,
                TGMua: new Date(selectedDate3).toISOString(),
                Chiphi: currency,
                Hinhthuc: type,
                NTC: new Date(selectedDate4).toISOString()
            }
        }
        const bodyData = {
            ...item,
            Vitri: position.id,
            TGThuviec: selectedDate,
            Lydo: otherReason ? otherReason : reason,
            Pheduyet: JSON.stringify(flagPheduyet)
        }
        const response = await ticketsAPI.updateTicket(bodyData, item.key)
        dispatch(updateTicket(response.data))
        // handleClose()
    }
    return (
        <React.Fragment >
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <form onSubmit={form.handleSubmit(handleEditTicket)}>
                    <DialogTitle id="alert-dialog-title" className={classes.title}>Phiếu yêu cầu tuyển dụng
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <AutocompleteObjField
                                    value={valuePosition}
                                    options={position}
                                    onChange={(e, newValue) => { setValuePosition(newValue) }}
                                    field="Thuoctinh"
                                    label="Vị trí tuyển dụng"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <InputField form={form} name="SLHT" label="Nhân sự hiện có" type="number" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <InputField form={form} name="SLCT" label="Nhân sự cần tuyển" type="number" />
                            </Grid>
                            {/* Mức lương dự kiến  */}
                            <Grid item xs={12} md={6}>
                                <NumberField form={form} name="LuongDK" label="Mức lương dự kiến" error="Vui lòng nhập mức lương" />
                            </Grid>
                            {/* Lí do tuyển dụng  */}
                            <Grid item xs={12} md={6}>
                                <SelectField label="Lí do tuyển dụng" value={reason} arrayItem={arrayReason} handleChange={setReason} />
                            </Grid>
                            {!arrayReason.includes(item.Lydo) &&
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
                            {/* Thời gian thử việc  */}
                            <Grid item xs={12}>
                                <DateField label="Thời gian thử việc" value={selectedDate} handleChange={setSelectedDate} />
                            </Grid>
                            {/* Mô tả tuyển dụng  */}
                            <Grid item xs={12}>
                                <Tinymce form={form} name="Mota" label={"Mô tả tuyển dụng"} />
                            </Grid>
                            <Grid item xs={12}>
                                <Tinymce form={form} name="Yeucau" label={"Yêu cầu tuyển dụng"} />
                            </Grid>
                            {/* Nguồn  */}
                            <Grid item xs={12}>
                                <SelectField label="Nguồn" value={source} arrayItem={arraySource} handleChange={setSource} disabled={checkStep} />
                            </Grid>
                            {/* Thời gian mua  */}
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth className={classes.field}>
                                    <DateField label="Thời gian mua" value={selectedDate3} handleChange={setSelectedDate3} disabled={checkStep} />
                                </FormControl>
                            </Grid>
                            {/* Chi phí mua  */}
                            <Grid item xs={12}>
                                <NumberFormat
                                    label={"Chi phí mua"}
                                    customInput={TextField}
                                    thousandSeparator
                                    error={steps[1] && currency == ""}
                                    helperText={(steps[1] && currency == "") == "" ? "Vui lòng nhập chi phí" : null}
                                    onChange={(e, newValue) => { setCurrency(newValue) }}
                                    defaultValue={currency}
                                    allowLeadingZeros={false}
                                    fullWidth
                                    disabled={checkStep}
                                />
                            </Grid>
                            {/* Hình thức thanh toán  */}
                            <Grid item xs={12}>
                                <SelectField label="Hình thức thanh toán" value={type} arrayItem={arrayType} handleChange={setType} disabled={checkStep} />
                            </Grid>
                            {/* Ngày cần thanh toán  */}
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth className={classes.field}>
                                    <DateField label="Ngày cần thanh toán" value={selectedDate4} handleChange={setSelectedDate4} disabled={checkStep} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" variant="contained">
                            Cập nhật tuyển dụng
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    )
}

export default ModalEditItem
