import React, { useState } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket } from 'app/store/fuse/ticketsSlice';
//MUI
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, makeStyles } from '@material-ui/core';
import { Grid, Tooltip, IconButton } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import NumberFormat from 'react-number-format';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
//FORM
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
// COMPONENT 
import InputField from "../CustomField/InputField"
import DateField from '../CustomField/DateField';
import SelectField from "../CustomField/SelectField"
import NumberField from '../CustomField/NumberField';
import Tinymce from '../CustomField/Tinymce';
import AutocompleteObjField from '../CustomField/AutocompleteObj';
// API 
import ticketsAPI from "api/ticketsAPI"
const schema = yup.object().shape({
    LuongDK: yup.string().required("Vui lòng nhập lương dự kiến"),
    SLHT: yup.number().min(0, "Dữ liệu không đúng"),
    SLCT: yup.number().min(1, "Dữ liệu không đúng"),
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
const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
const arraySource = ["Facebook", "ITViec", "TopCV"]
const arrayType = ["Thanh toán tiền mặt", "Chuyển khoản"]
const ModalEditItem = ({ item, open, handleClose }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const position = useSelector(state => state.fuse.tickets.position)
    const steps = JSON.parse(item['Pheduyet'])
    const checkStep = steps.length < 3
    const [valuePosition, setValuePosition] = useState(position.find(flag => flag.id == item.Vitri))
    const [selectedDate, setSelectedDate] = useState(item.TGThuviec)
    const [selectedDate4, setSelectedDate4] = useState(steps[1] && steps[1].NTC || "")
    const [reason, setReason] = useState(arrayReason.includes(item.Lydo) ? item.Lydo : "Khác")
    const [otherReason, setOtherReason] = useState(!arrayReason.includes(item.Lydo) ? item.Lydo : "")
    const [description, setDescription] = useState(item.Mota)
    const [require, setRequire] = useState(item.Yeucau)
    const [valueCPTD, setValueCPTD] = useState(steps[1]?.CPTD || [])
    const form = useForm({
        defaultValues: {
            SLCT: item.SLCT,
            SLHT: item.SLHT,
            LuongDK: item.LuongDK,
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });
    const handleEditTicket = async (e) => {
        const flagPheduyet = [...JSON.parse(item['Pheduyet'])]
        if (flagPheduyet[2]) {
            const CPTD = valueCPTD.map(item => {
                return { ...item, TGMua: new Date(item.TGMua).toISOString() }
            })
            flagPheduyet[1] = {
                ...flagPheduyet[1],
                CPTD: CPTD,
                NTC: new Date(selectedDate4).toISOString()
            }
        }
        const bodyData = {
            ...item,
            LuongDK: e.LuongDK.split(",").join(''),
            SLCT: e.SLCT,
            SLHT: e.SLHT,
            Yeucau: require,
            Mota: description,
            Vitri: valuePosition.id,
            TGThuviec: new Date(selectedDate[0]).toISOString(),
            Lydo: otherReason ? otherReason : reason,
            Pheduyet: JSON.stringify(flagPheduyet)
        }
        const response = await ticketsAPI.updateTicket(bodyData, item.key)
        dispatch(updateTicket(response.data))
        handleClose()
    }
    const handleAddSource = (e) => {
        setValueCPTD([...valueCPTD, { Nguon: "", Chiphi: "", Hinhthuc: '', TGMua: new Date() }]);
    }
    const handleRemoveSource = (index) => {
        const list = [...valueCPTD];
        list.splice(index, 1);
        setValueCPTD(list);
    }
    const handleChangeCurrency = (e, index) => {
        const { value } = e.target;
        const list = [...valueCPTD]
        list[index]['Chiphi'] = value.split(",").join('')
        setValueCPTD(list)
    }
    const handleChangeSource = (e, index) => {
        const { value } = e.target;
        const list = [...valueCPTD]
        list[index]['Nguon'] = value
        setValueCPTD(list)
    }
    const handleChangeType = (e, index) => {
        const { value } = e.target;
        const list = [...valueCPTD]
        list[index]['Hinhthuc'] = value
        setValueCPTD(list)
    }
    const handleChangeDate = (e, index) => {
        const list = [...valueCPTD]
        list[index]['TGMua'] = e[0]
        setValueCPTD(list)
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
                                    onChange={(e, newValue) => { setValuePosition(newValue) }}
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
                                <SelectField label="Lí do tuyển dụng" value={reason} arrayItem={arrayReason} handleChange={(e) => { setReason(e.target.value) }} />
                            </Grid>
                            {item.Lydo === "Khác" &&
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
                            <Grid item xs={12}>
                                <DateField label="Thời gian thử việc" value={selectedDate} handleChange={(e) => { setSelectedDate(e) }} />
                            </Grid>
                            {/* Mô tả tuyển dụng  */}
                            <Grid item xs={12}>
                                <Tinymce value={description} onChange={(e) => { setDescription(e) }} label={"mô tả tuyển dụng"} />
                            </Grid>
                            <Grid item xs={12}>
                                <Tinymce value={require} onChange={(e) => { setRequire(e) }} label={"yêu cầu tuyển dụng"} />
                            </Grid>
                            {valueCPTD && valueCPTD.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* Nguồn mua  */}
                                    <Grid item xs={12} md={3}>
                                        <SelectField
                                            label="Nguồn mua" value={item.Nguon} arrayItem={arraySource}
                                            handleChange={(e) => handleChangeSource(e, index)}
                                            disabled={steps.length === 7}
                                        />
                                    </Grid>
                                    {/* Chi phí mua  */}
                                    <Grid item xs={12} md={3}>
                                        <NumberFormat
                                            label={"Chi phí"}
                                            customInput={TextField}
                                            thousandSeparator
                                            onChange={(e) => { handleChangeCurrency(e, index) }}
                                            value={item.Chiphi}
                                            allowLeadingZeros={false}
                                            fullWidth
                                        />
                                    </Grid>
                                    {/* Thời gian mua  */}
                                    <Grid item xs={12} md={2}>
                                        <DateField label="Thời gian mua" value={item.TGMua}
                                            handleChange={(e) => handleChangeDate(e, index)}
                                        />
                                    </Grid>
                                    {/* Hình thức thanh toán  */}
                                    <Grid item xs={12} md={3}>
                                        <SelectField label="Hình thức thanh toán" value={item.Hinhthuc || ''} arrayItem={arrayType}
                                            handleChange={(e) => handleChangeType(e, index)}
                                        />
                                    </Grid>
                                    {/* Thêm / xóa nguồn  */}
                                    <Grid item xs={12} md>
                                        {valueCPTD.length !== 1 && <Tooltip title="Xóa nguồn">
                                            <>
                                                <IconButton onClick={() => { handleRemoveSource(index) }} style={{ marginTop: "16px" }}
                                                    disabled={steps.length === 7}>
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                            </>
                                        </Tooltip>}
                                        <Tooltip title="Thêm nguồn">
                                            <>
                                                <IconButton onClick={handleAddSource} style={{ marginTop: "16px" }}
                                                    disabled={steps.length === 7}>
                                                    <AddCircleOutlineIcon />
                                                </IconButton>
                                            </>
                                        </Tooltip>
                                    </Grid>
                                </React.Fragment>
                            ))}
                            {/* Ngày cần thanh toán  */}
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <DateField label="Ngày cần thanh toán" value={selectedDate4} handleChange={setSelectedDate4} disabled={checkStep} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ paddingRight: "22px" }}>
                        <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose} size="large">
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" variant="contained" size="large">
                            Cập nhật tuyển dụng
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    )
}

export default ModalEditItem
