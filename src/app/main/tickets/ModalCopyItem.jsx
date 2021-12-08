import React, { useState } from 'react'
//REDUX
import { useDispatch } from 'react-redux';
import { addTicket } from 'app/store/fuse/ticketsSlice';
//MUI
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid } from '@mui/material';
//FORM
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
//COMPONENTS
import InputField from "../CustomField/InputField"
import DateField from '../CustomField/DateField';
import SelectField from "../CustomField/SelectField"
import NumberField from '../CustomField/NumberField';
import Tinymce from '../CustomField/Tinymce';
import AutocompleteObjField from '../CustomField/AutocompleteObj'
//API
import ticketsAPI from 'api/ticketsAPI';
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
const ModalCopyItem = ({ item, data, open, handleClose }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(item.TGThuviec)
    const [reason, setReason] = useState(arrayReason.includes(item.Lydo) ? item.Lydo : "Khác")
    const [otherReason, setOtherReason] = useState(!arrayReason.includes(item.Lydo) ? item.Lydo : "")
    const [position, setPosition] = useState([...data.position])
    const [valuePosition, setValuePosition] = useState(position.find(flag => flag.id == item.Vitri))
    const [censor, setCensor] = useState([...data.users])
    const [valueCensor, setValueCensor] = useState(null)
    const [description, setDescription] = useState('')
    const [require, setRequire] = useState('')
    const form = useForm({
        defaultValues: {
            SLCT: item.SLCT,
            SLHT: item.SLHT,
            LuongDK: item.LuongDK,
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const reasonValid = otherReason ? otherReason !== "" : reason !== ""
    const isValid = form.formState.isValid && reasonValid && valueCensor !== null && valuePosition !== null && require !== "" && description !== ""
    const handleEditTicket = async (e) => {
        const flag = {
            Vitri: valuePosition['id'],
            SLHT: e.SLHT,
            SLCT: e.SLCT,
            TGThuviec: new Date(selectedDate).toISOString(),
            TNNS: {},
            Lydo: otherReason ? otherReason : reason,
            Mota: description,
            Yeucau: require,
            Pheduyet: [],
            LuongDK: e.LuongDK.split(',').join(''),
        }
        const step = { id: 0, nguoiDuyet: valueCensor.id, status: 0, ngayTao: new Date().toISOString() }
        flag.Pheduyet.push(step)
        const bodyData = {
            ...flag,
            TNNS: JSON.stringify(flag.TNNS),
            Pheduyet: JSON.stringify(flag.Pheduyet)
        }
        const response = await ticketsAPI.postTicket(bodyData)
        dispatch(addTicket(response.data))
        dispatch(closeDialog())
    }
    const handleCensorChange = (event, newValue) => {
        setValueCensor(newValue)
    }
    const handlePositionChange = (event, newValue) => {
        setValuePosition(newValue)
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
                                    onChange={handlePositionChange}
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
                            <Grid item xs={12} md={12}>
                                <DateField label="Thời gian thử việc" value={selectedDate} handleChange={setSelectedDate} />
                            </Grid>
                            {/* Mô tả / yêu cầu tuyển dụng  */}
                            <Grid item xs={12}>
                                <Tinymce value={require} onChange={(e) => { setRequire(e) }} label={"yêu cầu tuyển dụng"} />
                            </Grid>
                            <Grid item xs={12}>
                                <Tinymce value={description} onChange={(e) => { setDescription(e) }} label={"mô tả tuyển dụng"} />
                            </Grid>
                            <Grid item xs={12}>
                                <AutocompleteObjField
                                    value={valueCensor}
                                    options={censor}
                                    onChange={handleCensorChange}
                                    field="name"
                                    label="Quản lí phê duyệt"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ paddingRight: "22px" }}>
                        <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose} size="large">
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" variant="contained" size="large" disabled={!isValid}>
                            Cập nhật tuyển dụng
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    )
}

export default ModalCopyItem
