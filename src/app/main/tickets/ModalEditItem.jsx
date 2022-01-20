import React, { useState } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket } from 'app/store/fuse/ticketsSlice';
import { showMessage } from "app/store/fuse/messageSlice"
//MUI
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox } from '@mui/material';
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
    TGThuviec: yup.number().min(1, "Dữ liệu không đúng"),
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
const CustomInput = (props) => {
    return <TextField {...props} InputLabelProps={{ shrink: true }} />
}
const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực", "Khác"]
const arraySource = ["Facebook", "ITViec", "TopCV"]
const arrayType = ["Thanh toán tiền mặt", "Chuyển khoản"]
const ModalEditItem = ({ item, open, handleClose }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const position = useSelector(state => state.fuse.tickets.position)
    const steps = JSON.parse(item['Pheduyet'])
    const salary = JSON.parse(item.LuongDK)
    const [valuePosition, setValuePosition] = useState(position.find(flag => flag.id == item.Vitri))
    const [selectedDate, setSelectedDate] = useState(item.TGThuviec)
    const [selectedDate4, setSelectedDate4] = useState(steps[3] && steps[3].NTC || "")
    const [reason, setReason] = useState(arrayReason.includes(item.Lydo) ? item.Lydo : "Khác")
    const [otherReason, setOtherReason] = useState(!arrayReason.includes(item.Lydo) ? item.Lydo : "")
    const [description, setDescription] = useState(item.Mota)
    const [require, setRequire] = useState(item.Yeucau)
    const [valueCPTD, setValueCPTD] = useState(steps[3]?.CPTD || [])
    const [minCurrency, setMinCurrency] = useState(salary.min)
    const [maxCurrency, setMaxCurrency] = useState(salary.max)
    const [typeCurrency, setTypeCurrency] = useState(salary.max !== null)
    const disabledButton = typeCurrency ? parseInt(maxCurrency.split(",").join("")) < parseInt(minCurrency.split(",").join("")) : false
    const form = useForm({
        defaultValues: {
            SLCT: item.SLCT,
            SLHT: item.SLHT,
            LuongDK: item.LuongDK,
            TGThuviec: item.TGThuviec,
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });
    const handleEditTicket = async (e) => {
        const flagPheduyet = [...JSON.parse(item['Pheduyet'])]
        if (flagPheduyet[4]) {
            const CPTD = valueCPTD.map(item => {
                return { ...item, TGMua: new Date(item.TGMua).toISOString() }
            })
            flagPheduyet[3] = {
                ...flagPheduyet[3],
                CPTD: CPTD,
                NTC: new Date(selectedDate4).toISOString()
            }
        }
        const bodyData = {
            ...item,
            LuongDK: JSON.stringify({ min: minCurrency.split(',').join(''), max: typeCurrency ? maxCurrency.split(',').join('') : null }),
            SLCT: e.SLCT,
            SLHT: e.SLHT,
            Yeucau: require,
            Mota: description,
            Vitri: valuePosition.id,
            TGThuviec: e.TGThuviec,
            Lydo: otherReason ? otherReason : reason,
            Pheduyet: JSON.stringify(flagPheduyet)
        }
        const response = await ticketsAPI.updateTicket(bodyData, item.key)
        dispatch(updateTicket(response.data))
        dispatch(showMessage({
            message: 'Cập nhật thành công',
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            },
            variant: 'success'
        }))
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
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <InputField form={form} name="SLHT" label="Nhân sự hiện có" type="number" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <InputField form={form} name="SLCT" label="Nhân sự cần tuyển" type="number" />
                            </Grid>
                            {/* Mức lương dự kiến  */}
                            <Grid item container xs={12} md={4} spacing={2}>
                                <Grid item xs={typeCurrency ? 5 : 10}>
                                    <NumberFormat
                                        value={minCurrency}
                                        label={typeCurrency ? "Mức lương tối thiểu" : "Mức lương dự kiến"}
                                        customInput={CustomInput}
                                        thousandSeparator
                                        allowLeadingZeros={false}
                                        fullWidth
                                        onChange={(e) => { setMinCurrency(e.target.value) }}
                                    />
                                </Grid>
                                {typeCurrency && (
                                    <Grid item xs={5}>
                                        <NumberFormat
                                            value={maxCurrency}
                                            label={"Mức lương tối đa"}
                                            customInput={CustomInput}
                                            thousandSeparator
                                            allowLeadingZeros={false}
                                            fullWidth
                                            onChange={(e) => { setMaxCurrency(e.target.value) }}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs>
                                    <Checkbox style={{ marginTop: "20px" }} checked={typeCurrency} onChange={() => { setTypeCurrency(state => !state) }} />
                                </Grid>
                            </Grid>
                            {/* Lí do tuyển dụng  */}
                            <Grid item xs={12} md={4}>
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
                            <Grid item xs={4}>
                                <InputField form={form} name="TGThuviec" label="Thời gian thử việc" type="number" />
                            </Grid>
                            {/* Mô tả tuyển dụng  */}
                            <Grid item xs={12} md={6}>
                                <Tinymce value={description} onChange={(e) => { setDescription(e) }} label={"mô tả tuyển dụng"} />
                            </Grid>
                            <Grid item xs={12} md={6}>
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
                                            disabled={steps.length === 7}
                                        />
                                    </Grid>
                                    {/* Thời gian mua  */}
                                    <Grid item xs={12} md={2}>
                                        <DateField
                                            label="Thời gian mua"
                                            value={item.TGMua}
                                            disabled={steps.length === 7}
                                            handleChange={(e) => handleChangeDate(e, index)}
                                        />
                                    </Grid>
                                    {/* Hình thức thanh toán  */}
                                    <Grid item xs={12} md={3}>
                                        <SelectField
                                            label="Hình thức thanh toán"
                                            value={item.Hinhthuc || ''}
                                            arrayItem={arrayType}
                                            disabled={steps.length === 7}
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
                            {valueCPTD.length !== 0 && <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <DateField label="Ngày cần thanh toán"
                                        value={selectedDate4}
                                        handleChange={setSelectedDate4}
                                        disabled={steps.length === 7} />
                                </FormControl>
                            </Grid>}
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ paddingRight: "22px" }}>
                        <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose} size="large">
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" variant="contained" size="large" disabled={disabledButton}>
                            Cập nhật tuyển dụng
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    )
}

export default ModalEditItem
