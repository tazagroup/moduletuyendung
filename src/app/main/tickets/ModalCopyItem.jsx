import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid } from '@mui/material';
//FORM
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import InputField from "../CustomField/InputField"
import DateField from '../CustomField/DateField';
import SelectField from "../CustomField/SelectField"
import NumberField from '../CustomField/NumberField';
import Tinymce from '../CustomField/Tinymce';
import AutocompleteField from '../CustomField/Autocomplete'
const schema = yup.object().shape({
    LuongDK: yup.string().required("Vui lòng nhập mức lương"),
    SLHT: yup.number("Vui lòng nhập số").required("Vui lòng nhập số lượng hiện tại").min(0, "Dữ liệu không chính xác"),
    SLCT: yup.number("Vui lòng nhập số").required("Vui lòng nhập số lượng cần tuyển").min(1, "Dữ liệu không chính xác"),
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
    gridLeft: {
        paddingRight: "8px"
    },
    gridRight: {
        paddingLeft: "8px"
    }
})
const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
const ModalCopyItem = ({ item, open, handleClose }) => {
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(item.TGThuviec)
    const [selectedDate2, setSelectedDate2] = useState(item.TiepnhanNS)
    const [reason, setReason] = useState(arrayReason.includes(item.Lydo) ? item.Lydo : "Khác")
    const [otherReason, setOtherReason] = useState(!arrayReason.includes(item.Lydo) ? item.Lydo : "")
    const [censor, setCensor] = useState('')
    const form = useForm({
        defaultValues: {
            SLCT: item.SLCT,
            SLHT: item.SLHT,
            LuongDK: item.LuongDK,
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });

    const isValid = form.formState.isValid
    const reasonCondition = reason === "Khác" ? otherReason !== "" : reason !== ""
    const disabledButton = isValid && reasonCondition && censor !== ""
    const handleEditTicket = async (e) => {
        const bodyData = {
            ...e,
            TGThuviec: selectedDate,
            TiepnhanNS: selectedDate2,
            Lydo: otherReason ? otherReason : reason,
            idTao: item.idTao,
            Pheduyet: [],
        }
        const step = { id: 0, nguoiDuyet: censor, status: 0, ngayTao: new Date().toISOString() }
        bodyData.Pheduyet.push(step)
        console.log(bodyData)
        // await axios.post(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets`, bodyData)
        // setIsFetching(state => !state)
        // handleClose()
    }
    const handleCensorChange = (event, newValue) => {
        setCensor(newValue)
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
                            <Grid item xs={12}>
                                <AutocompleteField label="Quản lí xét duyệt" value={censor} arrayItem={arrayCensor} handleChange={handleCensorChange} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ paddingRight: "22px" }}>
                        <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose} size="large">
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" disabled={!disabledButton} variant="contained" size="large">
                            Cập nhật tuyển dụng
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    )
}

export default ModalCopyItem
