import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
//FORM
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import InputField from "../CustomField/InputField"
import DateField from '../CustomField/DateField';
import SelectField from "../CustomField/SelectField"
import NumberField from '../CustomField/NumberField';
import Tinymce from '../CustomField/Tinymce';
const schema = yup.object().shape({
    Vitri: yup.string().required("Vui lòng nhập vị trí"),
    LuongDK: yup.string().required("Vui lòng nhập lương dự kiến"),
    SLHientai: yup.number().min(0, "Dữ liệu không đúng"),
    SLCantuyen: yup.number().min(1, "Dữ liệu không đúng"),
    MotaTD: yup.string().required("Vui lòng nhập mô tả tuyển dụng"),
    YeucauTD: yup.string().required("Vui lòng nhập yêu cầu tuyển dụng"),
    Chiphi: yup.string().required("Vui lòng nhập chi phí"),
    Tinhtrang: yup.string().default("Chưa thanh toán"),
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
const ModalEditItem = ({ item, open, handleClose, setIsFetching }) => {
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(item.TGThuviec)
    const [selectedDate2, setSelectedDate2] = useState(item.TiepnhanNS)
    const [selectedDate3, setSelectedDate3] = useState(item.TGMua ? item.TGMua : null)
    const [selectedDate4, setSelectedDate4] = useState(item.NTC ? item.NTC : null)
    const [reason, setReason] = useState(arrayReason.includes(item.Lydo) ? item.Lydo : "Khác")
    const [otherReason, setOtherReason] = useState(!arrayReason.includes(item.Lydo) ? item.Lydo : "")
    const [source, setSource] = useState(item.Nguon ? item.Nguon : "")
    const [type, setType] = useState(item.Hinhthuc !== "" ? item.Hinhthuc : "")
    const form = useForm({
        defaultValues: {
            Vitri: item.Vitri,
            SLCantuyen: item.SLCantuyen,
            SLHientai: item.SLHientai,
            MotaTD: item.MotaTD,
            YeucauTD: item.YeucauTD,
            Chiphi: item.Chiphi || " ",
            LuongDK: item.LuongDK,
            Tinhtrang: item.Tinhtrang
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const checkStep = item.Pheduyet.length <= 3
    const isValid = form.formState.isValid
    const reasonCondition = reason === "Khác" ? otherReason !== "" : reason !== ""
    const disabledButton = isValid && reasonCondition && checkStep ? (source !== "" && type) !== "" : true
    const handleEditTicket = async (e) => {
        const bodyData = {
            ...e,
            TGThuviec: selectedDate,
            TiepnhanNS: selectedDate2,
            Lydo: otherReason ? otherReason : reason,
            Pheduyet: item.Pheduyet,
            idTao: item.idTao,
            Nguon: source,
            TGMua: selectedDate3,
            Hinhthuc: type,
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
                <form onSubmit={form.handleSubmit(handleEditTicket)}>
                    <DialogTitle id="alert-dialog-title" className={classes.title}>Phiếu yêu cầu tuyển dụng
                    </DialogTitle>
                    <CloseIcon className={classes.icon} onClick={handleClose} />
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <InputField form={form} name="Vitri" label="Vị trí tuyển dụng" type="text" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <InputField form={form} name="SLHientai" label="Nhân sự hiện có" type="number" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <InputField form={form} name="SLCantuyen" label="Nhân sự cần tuyển" type="number" />
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
                            <Grid item xs={12} md={6}>
                                <DateField label="Thời gian thử việc" value={selectedDate} handleChange={setSelectedDate} />
                            </Grid>
                            {/* Thời gian tiếp nhận  */}
                            <Grid item xs={12} md={6}>
                                <DateField label="Thời gian tiếp nhận" value={selectedDate2} handleChange={setSelectedDate2} />
                            </Grid>
                            {/* Mô tả tuyển dụng  */}
                            <Grid item xs={12}>
                                <Tinymce form={form} name="MotaTD" label={"Mô tả tuyển dụng"} />
                            </Grid>
                            <Grid item xs={12}>
                                <Tinymce form={form} name="YeucauTD" label={"Yêu cầu tuyển dụng"} />
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
                                <NumberField form={form} name="Chiphi" label="Chi phí mua" error="Vui lòng nhập chi phí" disabled={checkStep} />
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
                        <Button color="primary" autoFocus type="submit" disabled={!disabledButton} variant="contained">
                            Cập nhật tuyển dụng
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    )
}

export default ModalEditItem
