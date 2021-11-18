import React, { useState, useRef } from 'react'
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
import axios from 'axios';
const useStyles = makeStyles({
    wrapperArea: {
        border: "1px solid #bbbec4",
        marginTop: 10,
        borderRadius: "3px",
        padding: 5,
    },
    textarea: {
        width: "100%",
        backgroundColor: "transparent",
        outline: "none"
    }
})

const ModalCreateItem = ({ setIsFetching }) => {
    const dispatch = useDispatch();
    const classes = useStyles()
    const [values, setValues] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedDate2, setSelectedDate2] = useState(new Date())
    const [reasons, setReasons] = useState('');
    const [reasons2, setReasons2] = useState('');
    const [isOther, setIsOther] = useState(false)
    const [censor, setCensor] = useState('')
    //GET FORM DATA
    const [Vitri, setVitri] = useState('')
    const [SLHientai, setSLHientai] = useState('')
    const [SLCantuyen, setSLCantuyen] = useState('')
    const [YeucauTD, setYeucauTD] = useState('')
    const [MotaTD, setMotaTD] = useState('')
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
    const handleCreateTickets = async () => {
        const bodyData = {
            Vitri: Vitri,
            SLHientai: SLHientai,
            SLCantuyen: SLCantuyen,
            TGThuviec: selectedDate.toLocaleDateString('en-GB'),
            TiepnhanNS: selectedDate2.toLocaleDateString('en-GB'),
            Lydo: reasons2 ? reasons2 : reasons,
            MotaTD: MotaTD,
            YeucauTD: YeucauTD,
            Pheduyet: [],
            idTao: "TazaGroup",
            LuongDK: values,
        }
        const response = await axios.post('https://6195d82474c1bd00176c6ede.mockapi.io/Tickets', bodyData)
        console.log(response)
        setIsFetching(true)
        dispatch(closeDialog())
    }
    return (
        <React.Fragment >
            <DialogTitle id="alert-dialog-title" style={{ width: "100%", textAlign: "center", fontSize: "15px", fontWeight: "bold" }}>Phiếu yêu cầu tuyển dụng</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            // helperText="Please enter your name"
                            id="demo-helper-text-aligned"
                            label="Vị trí tuyển dụng"
                            fullWidth
                            variant="standard"
                            value={Vitri}
                            onChange={(e) => { setVitri(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Nhân sự hiện có"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={SLHientai}
                            onChange={(e) => { setSLHientai(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Nhân sự cần tuyển"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={SLCantuyen}
                            onChange={(e) => { setSLCantuyen(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <NumberFormat customInput={TextField}
                            label="Mức lương dự kiến"
                            variant="standard"
                            thousandSeparator={true}
                            value={values}
                            onChange={handleCurrencyChange}
                            autoComplete="off"
                            suffix="đ"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="demo-customized-textbox" style={{ fontSize: "1em", fontWeight: "500", paddingBottom: "4px" }}>Lí do tuyển dụng</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={reasons}
                                onChange={handleReasonChange}
                                label="Lí do tuyển dụng"
                                placeholder="Lí do tuyển dụng"
                                MenuProps={{ disablePortal: true }}
                                style={{ lineHeight: "28px", fontSize: "19px" }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
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
                                onChange={(e) => { setReasons2(e.target.value) }}
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
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                views={['year', 'month', 'day']}
                                label="Thời gian tiếp nhận"
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
                            id="demo-helper-text-aligned"
                            label="Mô tả tuyển dụng"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={MotaTD}
                            onChange={(e) => { setMotaTD(e.target.value) }}
                        />
                    </Grid>
                </Grid>
                <div className={classes.wrapperArea}>
                    <textarea className={classes.textarea}
                        rows="10" cols="10"
                        placeholder="Yêu cầu tuyển dụng:"
                        autoFocus required
                        value={YeucauTD}
                        onChange={(e) => { setYeucauTD(e.target.value) }}
                    >
                    </textarea>
                </div>
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
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"Nguyen Van A"}>Nguyen Van A</MenuItem>
                        <MenuItem value={"Nguyen Van B"}>Nguyen Van B</MenuItem>
                        <MenuItem value={"Nguyen Van C"}>Nguyen Van C</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleCreateTickets() }} color="primary" autoFocus>
                    Đăng tin tuyển dụng
                </Button>
            </DialogActions>
        </React.Fragment>
    );
}

export default ModalCreateItem
