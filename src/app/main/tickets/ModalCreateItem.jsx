import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import InputField from '../CustomField/InputField';
import NumberField from '../CustomField/NumberField'
import SelectField from "../CustomField/SelectField"
import DateField from "../CustomField/DateField"
import Tinymce from "../CustomField/Tinymce"
//FORM
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
const schema = yup.object().shape({
    Vitri: yup.string().required("Vui lòng nhập vị trí tuyển dụng"),
    LuongDK: yup.string().required("Vui lòng nhập mức lương"),
    SLHientai: yup.number().required("Vui lòng nhập số lượng hiện tại").min(0, "Dữ liệu không chính xác"),
    SLCantuyen: yup.number().required("Vui lòng nhập số lượng cần tuyển").min(1, "Dữ liệu không chính xác"),
    YeucauTD: yup.string().required("Vui lòng nhập yêu cầu tuyển dụng")
});
const useStyles = makeStyles({
    title: {
        width: "100%",
        textAlign: "center",
        fontSize: "20px !important",
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

const ModalCreateItem = ({ setIsFetching }) => {
    const form = useForm({
        defaultValues: {
            Vitri: "",
            LuongDK: "",
            SLHientai: 0,
            SLCantuyen: 0,
            YeucauTD: "<p>Yêu cầu tuyển dụng</p>",
            MotaTD: "<p>Mô tả tuyển dụng</p>",
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const dispatch = useDispatch();
    const classes = useStyles()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedDate2, setSelectedDate2] = useState(new Date())
    const [reasons, setReasons] = useState('');
    const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
    const [otherReason, setOtherReason] = useState('');
    const [isOther, setIsOther] = useState(false)
    const [censor, setCensor] = useState('')
    const arrayCensor = ["Phạm Chí Kiệt", "Phạm Chí Kiệt 2", "Phạm Chí Kiệt 3"]
    const isValid = form.formState.isValid
    const handleReasonChange = (event) => {
        setReasons(event.target.value)
        if (event.target.value === "Khác") { setIsOther(true) }
        else { setIsOther(false) }
    }
    const handleCensorChange = (event) => {
        setCensor(event.target.value)
    }
    //CREATE TICKETS
    const handleCreateTickets = async (e) => {
        const bodyData = {
            Vitri: e.Vitri,
            SLHientai: e.SLHientai,
            SLCantuyen: e.SLCantuyen,
            TGThuviec: selectedDate.toISOString(),
            TiepnhanNS: selectedDate2.toISOString(),
            Lydo: otherReason ? otherReason : reasons,
            MotaTD: e.MotaTD,
            YeucauTD: e.YeucauTD,
            Pheduyet: [],
            idTao: "TazaGroup",
            LuongDK: e.LuongDK.split(',').join(''),
            Nguon: "",
            TGMua: "",
            Chiphi: "",
            Hinhthuc: "",
            Tinhtrang: ""
        }
        const step = { id: 0, nguoiDuyet: censor, status: 0, ngayTao: new Date().toISOString() }
        bodyData.Pheduyet.push(step)
        const response = await axios.post('https://6195d82474c1bd00176c6ede.mockapi.io/Tickets', bodyData)
        setIsFetching(state => !state)
        dispatch(closeDialog())
    }
    return (
        <React.Fragment >
            <form onSubmit={form.handleSubmit(handleCreateTickets)}>
                <DialogTitle id="alert-dialog-title" className={classes.title}>Phiếu yêu cầu tuyển dụng
                </DialogTitle>
                <CloseIcon className={classes.icon} onClick={() => { dispatch(closeDialog()) }} />
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InputField form={form} name="Vitri" label={"Vị trí tuyển dụng"} type="text" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <InputField form={form} name="SLHientai" label={"Nhân sự hiện có"} type="number" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <InputField form={form} name="SLCantuyen" label={"Nhân sự cần tuyển"} type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DateField label="Thời gian thử việc" value={selectedDate} handleChange={setSelectedDate} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DateField label="Thời gian tiếp nhận" value={selectedDate2} handleChange={setSelectedDate2} />
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
                            <Tinymce form={form} name="YeucauTD" label={"Yêu cầu tuyển dụng"} />
                        </Grid>
                        <Grid item xs={12}>
                            <Tinymce form={form} name="MotaTD" label={"Mô tả tuyển dụng"} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SelectField label="Quản lí xét duyệt" value={censor} arrayItem={arrayCensor} handleChange={handleCensorChange} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" autoFocus type="submit" disabled={!isValid} variant="contained">
                        Đăng tin tuyển dụng
                    </Button>
                </DialogActions>
            </form>
        </React.Fragment>
    );
}

export default ModalCreateItem
