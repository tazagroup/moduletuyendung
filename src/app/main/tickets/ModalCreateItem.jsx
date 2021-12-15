import React, { useState } from 'react'
//REDUX
import { useDispatch } from 'react-redux';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { addTicket } from "app/store/fuse/ticketsSlice"
//MUI
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid } from '@mui/material';
import InputField from '../CustomField/InputField';
import NumberField from '../CustomField/NumberField'
import SelectField from "../CustomField/SelectField"
import DateField from "../CustomField/DateField"
import AutocompleteObjField from '../CustomField/AutocompleteObj';
import Tinymce from "../CustomField/Tinymce"
//FORM
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
//API
import ticketsAPI from "api/ticketsAPI"

//TEST

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

const ModalCreateItem = ({ data, open, handleClose }) => {
    const form = useForm({
        defaultValues: {
            LuongDK: "",
            SLHT: 0,
            SLCT: 0,
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
    const [otherReason, setOtherReason] = useState('');
    const [isOther, setIsOther] = useState(false)
    const [valueCensor, setValueCensor] = useState([])
    const [description, setDescription] = useState('')
    const [require, setRequire] = useState('')
    const [censor, setCensor] = useState([...data.users])
    const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
    const reasonValid = isOther ? otherReason !== "" : reasons !== ""
    const isValid = form.formState.isValid && reasonValid && valueCensor !== null && valuePosition !== null && require !== "" && description !== ""
    console.log(valueCensor)
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
            TGThuviec: new Date(selectedDate).toISOString(),
            TNNS: {},
            Lydo: otherReason ? otherReason : reasons,
            Mota: description,
            Yeucau: require,
            Pheduyet: [],
            LuongDK: e.LuongDK.split(',').join(''),
        }
        const step = { id: 0, Nguoiduyet: valueCensor.map(item => item.id), status: 0, Ngaytao: new Date().toISOString() }
        flag.Pheduyet.push(step)
        const bodyData = {
            ...flag,
            TNNS: JSON.stringify(flag.TNNS),
            Pheduyet: JSON.stringify(flag.Pheduyet)
        }
        const response = await ticketsAPI.postTicket(bodyData)
        dispatch(addTicket(response.data))
        handleClose()
    }
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={'xl'}
            onClose={handleClose}
        >
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
                        <Grid item xs={12} md={6}>
                            <DateField label="Thời gian thử việc" value={selectedDate} handleChange={setSelectedDate} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InputField form={form} name="SLHT" label={"Nhân sự hiện có"} type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InputField form={form} name="SLCT" label={"Nhân sự cần tuyển"} type="number" />
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
                            <Tinymce value={require} onChange={(e) => { setRequire(e) }} label={"yêu cầu tuyển dụng"} />
                        </Grid>
                        <Grid item xs={12}>
                            <Tinymce value={description} onChange={(e) => { setDescription(e) }} label={"mô tả tuyển dụng"} />
                        </Grid>
                        <Grid item xs={12}>
                            <AutocompleteObjField
                                value={valueCensor}
                                options={censor.filter(item => Array.isArray(item.PQTD) ? item.PQTD.includes("3") : item.PQTD == 3)}
                                onChange={handleCensorChange}
                                field="name"
                                label="Quản lí phê duyệt"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions style={{ paddingRight: "22px" }}>
                    <Button color="error" autoFocus type="submit" variant="contained" onClick={() => { handleClose() }} size="large">
                        Đóng
                    </Button>
                    <Button color="primary" autoFocus type="submit" variant="contained" disabled={!isValid} size="large">
                        Đăng tin tuyển dụng
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ModalCreateItem
