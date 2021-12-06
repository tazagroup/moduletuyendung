import React, { useState, useEffect } from 'react'
//REDUX
import { useDispatch } from 'react-redux';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { addTicket } from "app/store/fuse/ticketsSlice"
//MUI
import { DialogTitle, DialogContent, DialogActions, Button, Autocomplete } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid } from '@mui/material';
import InputField from '../CustomField/InputField';
import NumberField from '../CustomField/NumberField'
import SelectField from "../CustomField/SelectField"
import DateField from "../CustomField/DateField"
import AutocompleteObjField from '../CustomField/AutocompleteObj';
import AutocompleteField from '../CustomField/Autocomplete';
import Tinymce from "../CustomField/Tinymce"
//FORM
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
//API
import ticketsAPI from "api/ticketsAPI"

const schema = yup.object().shape({
    LuongDK: yup.string().required("Vui lòng nhập mức lương"),
    SLHT: yup.number().required("Vui lòng nhập số lượng hiện tại").min(0, "Dữ liệu không chính xác"),
    SLCT: yup.number().required("Vui lòng nhập số lượng cần tuyển").min(1, "Dữ liệu không chính xác"),
    Yeucau: yup.string().required("Vui lòng nhập yêu cầu tuyển dụng")
});
const useStyles = makeStyles({
    title: {
        width: "100%",
        textAlign: "center",
        fontSize: "25px !important",
        fontWeight: "bold !important"
    },
    textarea: {
        width: "100%",
        marginTop: "10px",
        padding: "10px 0",
        borderBottom: "1px solid #bbbec4",
        fontSize: "15px"
    },
    icon: {
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    }
})

const ModalCreateItem = ({ data }) => {
    const form = useForm({
        defaultValues: {
            LuongDK: "",
            SLHT: 0,
            SLCT: 0,
            Yeucau: "<p>Yêu cầu tuyển dụng</p>",
            Mota: "<p>Mô tả tuyển dụng</p>",
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const dispatch = useDispatch();
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [position, setPosition] = useState([...data.position])
    const [valuePosition, setValuePosition] = useState(null)
    const [reasons, setReasons] = useState('');
    const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
    const [otherReason, setOtherReason] = useState('');
    const [isOther, setIsOther] = useState(false)
    const [valueCensor, setValueCensor] = useState(null)
    const [censor, setCensor] = useState([...data.users])
    const reasonValid = isOther ? otherReason !== "" : reasons !== ""
    const isValid = form.formState.isValid && reasonValid && valueCensor !== null && valuePosition !== null
    const handleReasonChange = (event) => {
        setReasons(event.target.value)
        if (event.target.value === "Khác") { setIsOther(true) }
        else { setIsOther(false) }
    }
    const handleCensorChange = (event, newValue) => {
        setValueCensor(newValue)
    }
    const handlePositionChange = (event, newValue) => {
        setValuePosition(newValue)
    }
    //CREATE TICKETS
    const handleCreateTickets = async (e) => {
        const flag = {
            Vitri: valuePosition['id'],
            SLHT: e.SLHT,
            SLCT: e.SLCT,
            TGThuviec: selectedDate.toISOString(),
            TNNS: {},
            Lydo: otherReason ? otherReason : reasons,
            Mota: e.Mota,
            Yeucau: e.Yeucau,
            Pheduyet: [],
            LuongDK: e.LuongDK.split(',').join(''),
        }
        const step = { id: 0, Nguoiduyet: valueCensor.id, status: 0, ngayTao: new Date().toISOString() }
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
    return (
        <React.Fragment >
            <form onSubmit={form.handleSubmit(handleCreateTickets)}>
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
                            <InputField form={form} name="SLHT" label={"Nhân sự hiện có"} type="number" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <InputField form={form} name="SLCT" label={"Nhân sự cần tuyển"} type="number" />
                        </Grid>
                        <Grid item xs={12}>
                            <DateField label="Thời gian thử việc" value={selectedDate} handleChange={setSelectedDate} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <NumberField form={form} name="LuongDK" label="Mức lương dự kiến" error="Vui lòng nhập mức lương" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SelectField label="Lí do tuyển dụng" value={reasons} arrayItem={arrayReason} handleChange={handleReasonChange} />
                        </Grid>
                        {isOther &&
                            <Grid item xs={12}>
                                <TextField
                                    id="demo-helper-text-aligned"
                                    label="Lý do khác"
                                    type="text"
                                    onChange={(e) => { setOtherReason(e.target.value) }}
                                    fullWidth
                                    variant="standard" />
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <Tinymce form={form} name="Yeucau" label={"Yêu cầu tuyển dụng"} />
                        </Grid>
                        <Grid item xs={12}>
                            <Tinymce form={form} name="Mota" label={"Mô tả tuyển dụng"} />
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
                <DialogActions>
                    <Button color="error" autoFocus type="submit" variant="contained" onClick={() => { dispatch(closeDialog()) }}>
                        Đóng
                    </Button>
                    <Button color="primary" autoFocus type="submit" variant="contained" disabled={!isValid}>
                        Đăng tin tuyển dụng
                    </Button>
                </DialogActions>
            </form>
        </React.Fragment>
    );
}

export default ModalCreateItem
