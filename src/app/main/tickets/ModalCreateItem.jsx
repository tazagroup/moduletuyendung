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
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
//FORM
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
const schema = yup.object().shape({
    Vitri: yup.string().required(),
    SLHientai: yup.number().required(),
    SLCantuyen: yup.number().required(),
    MotaTD: yup.string().required(),
    YeucauTD: yup.string().required(),
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
    const dispatch = useDispatch();
    const classes = useStyles()
    const [values, setValues] = useState('');
    const [isValueEmpty, setIsValueEmpty] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedDate2, setSelectedDate2] = useState(new Date())
    const [reasons, setReasons] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [isOther, setIsOther] = useState(false)
    const [censor, setCensor] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const { Vitri, SLHientai, SLCantuyen, MotaTD, YeucauTD } = errors
    const reasonCondition = isOther ? otherReason == "" : reasons == ""
    const disabledButton = (Vitri || SLHientai || SLCantuyen || MotaTD || YeucauTD || values == "" || reasonCondition || censor == '') ? true : false
    const handleCurrencyChange = (event) => {
        setValues(event.target.value)
    };
    const handleReasonChange = (event) => {
        setReasons(event.target.value)
        if (event.target.value === "Khác") {
            setIsOther(true)
        }
        else {
            setIsOther(false)
        }

    }
    const handleCensorChange = (event) => {
        setCensor(event.target.value)
    }
    //CREATE TICKETS
    const handleCreateTickets = async (e) => {
        const LuongDK = values.split(',').join('').split('đ')[0]
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
            LuongDK: LuongDK,
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
            <form onSubmit={handleSubmit(handleCreateTickets)}>
                <DialogTitle id="alert-dialog-title" className={classes.title}>Phiếu yêu cầu tuyển dụng
                </DialogTitle>
                <CloseIcon className={classes.icon} onClick={() => { dispatch(closeDialog()) }} />
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                error={Vitri ? true : false}
                                helperText={Vitri ? "Vui lòng điền vị trí tuyển dụng" : ""}
                                id="demo-helper-text-aligned"
                                label="Vị trí tuyển dụng"
                                fullWidth
                                variant="standard"
                                {...register("Vitri")}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                id="demo-helper-text-aligned"
                                error={SLHientai ? true : false}
                                helperText={SLHientai ? "Vui lòng điền nhân sự hiện có" : ""}
                                label="Nhân sự hiện có"
                                type="number"
                                fullWidth
                                variant="standard"
                                {...register("SLHientai")}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                id="demo-helper-text-aligned"
                                error={SLCantuyen ? true : false}
                                helperText={SLCantuyen ? "Vui lòng điền nhân sự cần tuyển" : ""}
                                label="Nhân sự cần tuyển"
                                type="number"
                                fullWidth
                                variant="standard"
                                {...register("SLCantuyen")}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <NumberFormat customInput={TextField}
                                label="Mức lương dự kiến"
                                variant="standard"
                                thousandSeparator={true}
                                value={values}
                                error={isValueEmpty}
                                helperText={isValueEmpty ? "Vui lòng nhập mức lương" : ""}
                                onChange={handleCurrencyChange}
                                onBlur={(e) => { setIsValueEmpty(e.target.defaultValue == "") }}
                                autoComplete="off"
                                suffix="đ"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="demo-customized-textbox" style={{ fontSize: "15px", fontWeight: "500", paddingBottom: "4px" }}>Lí do tuyển dụng</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={reasons}
                                    onChange={handleReasonChange}
                                    label="Lí do tuyển dụng"
                                    placeholder="Lí do tuyển dụng"
                                    MenuProps={{ disablePortal: true }}
                                    style={{ lineHeight: "20px", fontSize: "15px" }}
                                >
                                    <MenuItem value={"Tuyển mới"}>Tuyển mới</MenuItem>
                                    <MenuItem value={"Thay thế"}>Thay thế</MenuItem>
                                    <MenuItem value={"Dự phòng nhân lực"}>Dự phòng nhân lực</MenuItem>
                                    <MenuItem value={"Khác"}>Khác</MenuItem>
                                </Select>
                            </FormControl>
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
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year', 'month', 'day']}
                                    label="Thời gian thử việc"
                                    value={selectedDate}
                                    onChange={(newValue) => {
                                        setSelectedDate(newValue);
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
                                    value={selectedDate2}
                                    onChange={(newValue) => {
                                        setSelectedDate2(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={MotaTD ? true : false}
                                helperText={MotaTD ? "Vui lòng nhập mô tả" : ""}
                                id="demo-helper-text-aligned"
                                label="Mô tả tuyển dụng"
                                type="text"
                                fullWidth
                                variant="standard"
                                {...register("MotaTD")}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            placeholder="Yêu cầu tuyển dụng"
                            className={classes.textarea}
                            {...register("YeucauTD")}
                        />
                    </Grid>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="demo-customized-textbox" style={{ fontSize: "1em", fontWeight: "500" }}>Chọn quản lí duyệt</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={censor}
                            onChange={handleCensorChange}
                            label="Chọn quản lí duyệt"
                            placeholder="Chọn quản lí duyệt"
                            MenuProps={{ disablePortal: true }}
                            style={{ fontSize: "19px" }}
                        >
                            <MenuItem value={"Nguyen Van A"}>Nguyen Van A</MenuItem>
                            <MenuItem value={"Nguyen Van B"}>Nguyen Van B</MenuItem>
                            <MenuItem value={"Nguyen Van C"}>Nguyen Van C</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" autoFocus type="submit" disabled={disabledButton} variant="contained">
                        Đăng tin tuyển dụng
                    </Button>
                </DialogActions>
            </form>
        </React.Fragment>
    );
}

export default ModalCreateItem
