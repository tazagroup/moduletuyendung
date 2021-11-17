import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid, InputLabel } from '@mui/material';
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker
} from "@material-ui/pickers"
import NumberFormat from 'react-number-format';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const useStyles = makeStyles({
    wrapper: {
        display: "flex",
        justifyContent: "space-between"
    },
    fieldNumber: {
        marginTop: 10,
        marginBottom: 10,
        width: "45%"
    },
    field: {
        marginTop: 10,
        marginBottom: 10,
    },
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

const ModalCreateItem = () => {
    const dispatch = useDispatch();
    const classes = useStyles()
    const [values, setValues] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date())
    const handleDateChange = (event) => {
        setSelectedDate(event)
    }
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

    }
    const [reasons, setReasons] = useState('');
    const [isOther, setIsOther] = useState(false)
    return (
        (
            <React.Fragment >
                <DialogTitle id="alert-dialog-title" style={{ width: "30vw", textAlign: "center", fontSize: "15px", fontWeight: "bold" }}>Phiếu yêu cầu tuyển dụng</DialogTitle>
                <DialogContent>
                    <TextField
                        // helperText="Please enter your name"
                        id="demo-helper-text-aligned"
                        label="Vị trí tuyển dụng"
                        fullWidth
                    />
                    <div className={classes.wrapper}>
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Nhân sự hiện có"
                            type="number"
                            className={classes.fieldNumber}
                        />
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Nhân sự cần tuyển"
                            type="number"
                            className={classes.fieldNumber}
                        />
                    </div>
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
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify='space-around'>
                            <KeyboardDatePicker
                                className={classes.field}
                                disableToolbar
                                variant='inline'
                                format='dd/MM/yyyy'
                                margin='normal'
                                id='date-picker'
                                label='Thời gian thử việc'
                                value={selectedDate}
                                autoOk={true}
                                onChange={handleDateChange}
                                fullWidth
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify='space-around'>
                            <KeyboardDatePicker
                                className={classes.field}
                                disableToolbar
                                variant='inline'
                                format='dd/MM/yyyy'
                                margin='normal'
                                id='date-picker'
                                label='Thời gian tiếp nhận'
                                value={selectedDate}
                                autoOk={true}
                                onChange={handleDateChange}
                                fullWidth
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="demo-customized-textbox" style={{ fontSize: "1em", fontWeight: "500" }}>Lí do tuyển dụng</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={reasons}
                            onChange={handleReasonChange}
                            label="Lí do tuyển dụng"
                            placeholder="Lí do tuyển dụng"
                            MenuProps={{ disablePortal: true }}
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
                    {isOther &&
                        <TextField
                            id="demo-helper-text-aligned"
                            label="Lý do khác"
                            type="text"
                            className={classes.field}
                            fullWidth
                        />
                    }
                    <div className={classes.wrapperArea}>
                        <textarea className={classes.textarea} rows="10" cols="15" placeholder="Yêu cầu ứng viên:" autoFocus required></textarea>
                    </div>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="demo-customized-textbox" style={{ fontSize: "1em", fontWeight: "500" }}>Chọn quản lí duyệt</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={reasons}
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
                    <Button onClick={() => dispatch(closeDialog())} color="primary" autoFocus>
                        Đăng tin tuyển dụng
                    </Button>
                </DialogActions>
            </React.Fragment>
        )
    )
}

export default ModalCreateItem
