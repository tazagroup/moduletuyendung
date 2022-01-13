import React, { useState } from 'react'
// REDUX 
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket } from "app/store/fuse/ticketsSlice"
import { closeDialog } from 'app/store/fuse/dialogSlice';
//MUI
import { DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid, IconButton, Tooltip } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import NumberFormat from 'react-number-format';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// REACT-HOOK-FORM
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup"
// import * as yup from "yup"
//COMPONENT
import SelectField from "../CustomField/SelectField"
import DateField from "../CustomField/DateField"
// API
import axios from 'axios';
import ticketsAPI from "api/ticketsAPI"
import noticesAPI from "api/noticesAPI"
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
        padding: "10px",
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
        paddingRight: "8px",
        marginTop: "15px !important"
    },
})

const CustomInput = (props) => {
    return <TextField {...props} InputLabelProps={{ shrink: true }} />
}
const TextInputCustom = (props) => {
    const { value, label, type } = props
    return (
        <TextField
            defaultValue={value}
            disabled={true}
            id="demo-helper-text-aligned"
            label={label}
            fullWidth
            variant="standard"
            type={type}
        />
    )
}
const ModalUpdateItem = ({ data, censor, showNotify, setDataStatus }) => {
    const dispatch = useDispatch();
    const classes = useStyles()
    const user = JSON.parse(localStorage.getItem("profile"))
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const position = useSelector(state => state.fuse.tickets.position)
    const sources = useSelector(state => state.fuse.tickets.source)
    const [sourceArray, setSourceArray] = useState(sources.map(item => item.Thuoctinh))
    const [subSourceArray, setSubSourceArray] = useState([])
    const typeArray = ["Chuyển khoản", "Thanh toán tiền mặt"]
    const reasons = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
    const [value, setValue] = useState('')
    const [sourceList, setSourceList] = useState([{ Nguon: "", Chiphi: "", TGMua: new Date(), Hinhthuc: '' }]);
    const [selectedDate2, setSelectedDate2] = useState(new Date())
    const isValid = sourceList.map(item => Object.values(item).every(x => x !== ''))
    //UPDATE TICKETS
    const convertSourceToId = (name) => {
        return sources.find(opt => opt.Thuoctinh == name).id
    }
    const handleUpdateTickets = async (e) => {
        const item = dataTicket.find(item => item.key === data.key)
        const step = JSON.parse(item['Pheduyet'])
        const CPTD = sourceList.map(item => {
            return { ...item, Nguon: convertSourceToId(item.Nguon), TGMua: new Date(item.TGMua).toISOString() }
        })
        step[3] = {
            ...step[3],
            status: 1,
            Daduyet: user.profile.id,
            CPTD: CPTD,
            NTC: new Date(selectedDate2).toISOString()
        }
        const newStep = { id: 4, status: 0, Nguoiduyet: [censor.id], Ngaytao: new Date().toISOString(), Ngayupdate: new Date().toISOString() }
        step.push(newStep)
        const bodyData = {
            Pheduyet: JSON.stringify([...step])
        }
        const response = await ticketsAPI.updateTicket(bodyData, item.key)
        const rowData = {
            ...data,
            Pheduyet: response.data.attributes.Pheduyet
        }
        showNotify()
        setDataStatus(rowData)
        dispatch(updateTicket(response.data))
        dispatch(closeDialog())
        //SEND NOTICE
        const noticeData = {
            "idGui": user.profile.id,
            "idNhan": censor.id,
            "idModule": 3,
            "Loai": 1,
            "Noidung": item.key,
            "idTao": user.profile.id
        }
        noticesAPI.postNotice(noticeData)
    }
    const handleCloseUpdateTickets = async (e) => {
        const item = dataTicket.find(item => item.key === data.key)
        const prevSteps = JSON.parse(data['Pheduyet'])
        const bodyData = {
            Pheduyet: JSON.stringify([...prevSteps])
        }
        dispatch(closeDialog())
        const response = await ticketsAPI.updateTicket(bodyData, item.key)
        dispatch(updateTicket(response.data))
    }
    const handleAddSource = () => {
        setSourceList([...sourceList, { Nguon: "", Chiphi: "", Hinhthuc: '', TGMua: new Date() }]);
    }
    const handleRemoveSource = (index) => {
        const list = [...sourceList];
        const subArray = [...subSourceArray]
        list.splice(index, 1);
        subArray.splice(index, 1)
        setSubSourceArray(subArray)
        setSourceList(list);
    }
    const handleChangeCurrency = (e, index) => {
        const { value } = e.target;
        const list = [...sourceList]
        list[index]['Chiphi'] = value.split(",").join('')
        setSourceList(list)
    }
    const handleChangeSource = (e, index) => {
        const { value } = e.target;
        const list = [...sourceList]
        list[index]['Nguon'] = value
        const subArray = list.map(item => item.Nguon)
        setSubSourceArray(subArray)
        setSourceList(list)
    }
    const handleChangeType = (e, index) => {
        const { value } = e.target;
        const list = [...sourceList]
        list[index]['Hinhthuc'] = value
        setSourceList(list)
    }
    const handleChangeDate = (e, index) => {
        const list = [...sourceList]
        list[index]['TGMua'] = e[0]
        setSourceList(list)
    }
    return (
        <React.Fragment >
            <DialogTitle id="alert-dialog-title" className={classes.title}>Phiếu yêu cầu tuyển dụng
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextInputCustom value={position.find(item => item.id == data.Vitri)?.Thuoctinh} label="Vị trí tuyển dụng" type="text" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextInputCustom value={data.SLHT} label="Nhân sự hiện có" type="number" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextInputCustom value={data.SLCT} label="Nhân sự cần tuyển" type="number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <NumberFormat
                            customInput={CustomInput}
                            label="Mức lương dự kiến"
                            variant="standard"
                            thousandSeparator={true}
                            value={data.LuongDK}
                            disabled={true}
                            autoComplete="off"
                            suffix="đ"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextInputCustom value={reasons.includes(data.Lydo) ? data.Lydo : "Khác"} label="Lí do tuyển dụng" type="text" />
                    </Grid>
                    {!reasons.includes(data.Lydo) &&
                        <Grid item xs={12}>
                            <TextInputCustom value={data.Lydo} label="Lí do khác" type="text" />
                        </Grid>
                    }
                    {/* Thời gian thử việc  */}
                    <Grid item xs={12} md={12}>
                        <TextInputCustom value={data.TGThuviec} label="Thời gian thử việc" type="number" />
                    </Grid>
                    {/* Người kiểm duyệt  */}
                    <Grid item xs={12}>
                        <TextInputCustom value={censor.name} label="Người kiểm duyệt" type="text" />
                    </Grid>
                    {sourceList.map((item, index) => (
                        <React.Fragment key={index}>
                            {/* Nguồn mua  */}
                            <Grid item xs={12} md={2}>
                                <SelectField
                                    label="Nguồn mua" value={item.Nguon} arrayItem={sourceArray}
                                    handleChange={(e) => handleChangeSource(e, index)}
                                    arraySubItem={subSourceArray}
                                />
                            </Grid>
                            {/* Thời gian mua  */}
                            <Grid item xs={12} md={2}>
                                <DateField label="Thời gian mua" value={item.TGMua}
                                    handleChange={(e) => handleChangeDate(e, index)}
                                />
                            </Grid>
                            {/* Chi phí mua  */}
                            <Grid item xs={12} md={3}>
                                <NumberFormat
                                    label={"Chi phí"}
                                    customInput={CustomInput}
                                    thousandSeparator
                                    onChange={(e) => { handleChangeCurrency(e, index) }}
                                    value={item.Chiphi}
                                    allowLeadingZeros={false}
                                    fullWidth
                                />
                            </Grid>
                            {/* Hình thức thanh toán  */}
                            <Grid item xs={12} md={3}>
                                <SelectField label="Hình thức thanh toán" value={item.Hinhthuc || ''} arrayItem={typeArray}
                                    handleChange={(e) => handleChangeType(e, index)}
                                />
                            </Grid>
                            {/* Thêm / xóa nguồn  */}
                            <Grid item xs={12} md>
                                {sourceList.length !== 1 && <Tooltip title="Xóa nguồn">
                                    <IconButton onClick={() => { handleRemoveSource(index) }} style={{ marginTop: "16px" }}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </Tooltip>}
                                <Tooltip title="Thêm nguồn">
                                    <IconButton onClick={handleAddSource} style={{ marginTop: "16px" }}>
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </React.Fragment>
                    ))}
                    {/* Ngày cần thanh toán  */}
                    <Grid item xs={12}>
                        <DateField label="Ngày cần thanh toán" value={selectedDate2} handleChange={setSelectedDate2} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions style={{ paddingRight: "22px" }}>
                <Button
                    color="error" autoFocus type="submit" variant="contained" size="large"
                    onClick={() => { handleCloseUpdateTickets() }}>
                    Đóng
                </Button>
                <Button
                    color="primary" autoFocus type="submit" variant="contained" size="large" disabled={!isValid.every(Boolean)}
                    onClick={() => { handleUpdateTickets() }}>
                    Cập nhật tuyển dụng
                </Button>
            </DialogActions>
        </React.Fragment >
    );
}

export default ModalUpdateItem
