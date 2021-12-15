import React, { useState } from 'react'
//REDUX
import { useDispatch } from 'react-redux';
import { updateTicket } from 'app/store/fuse/ticketsSlice';
//MUI
import { TextField } from '@material-ui/core';
import { Grid, Typography } from '@mui/material';
import NumberFormat from "react-number-format"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// API
import ticketsAPI from 'api/ticketsAPI';
const ModalApproveCurrency = (props) => {
    const { open, data, handleClose, setDataStatus } = props
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("profile"))
    const step = JSON.parse(data.Pheduyet)[1].CPTD
    const sourceArray = step.map(item => item.Nguon)
    const expectedCurrencyArray = step.map(item => item.Chiphi)
    const [value, setValue] = useState(step)
    const handleChangeCurrency = (e, index) => {
        const flag = [...value]
        flag[index]['CPTT'] = e.target.value.split(",").join('')
        setValue(flag)
    }
    const handleApprove = async (e) => {
        handleClose()
        const step = JSON.parse(data.Pheduyet)
        const flag = [...step]
        flag[1].CPTD = value
        flag[5] = { ...flag[5], status: 1, Nguoiduyet: user.profile.id, Ngayupdate: new Date().toISOString() }
        const newStep = { id: 6, status: 0, ngayTao: new Date().toISOString() }
        flag.push(newStep)
        const bodyData = {
            Pheduyet: JSON.stringify(flag)
        }
        const response = await ticketsAPI.updateTicket(bodyData, data.key)
        const rowData = {
            ...data,
            Pheduyet: response.data.attributes.Pheduyet
        }
        dispatch(updateTicket(response.data))
        setDataStatus(rowData)
    }
    const availableError = value.map(item => Number(item?.CPTT) > Number(item.Chiphi.split(',').join('')))
    const emptyError = value.map(item => item?.CPTT == '' ? Number(item?.CPTT) == 0 : item?.CPTT == undefined)
    const disabledButton = emptyError.includes(true) || availableError.includes(true)
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={"sm"}
        >
            <DialogTitle id="alert-dialog-title" style={{ fontSize: "20px", textAlign: "center" }}>Chi phí đã thanh toán</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" style={{ textAlign: "center", marginBottom: "5px" }}>Nguồn</Typography>
                        {sourceArray.map((item, index) => (
                            <TextField key={index} id="standard-basic" variant="standard" value={item} fullWidth disabled={true} style={{ marginBottom: "15px" }} />
                        ))}
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Typography variant="h5" style={{ textAlign: "center", marginBottom: "5px" }}>Chi phí dự kiến</Typography>
                        {expectedCurrencyArray.map((item, index) => (
                            <NumberFormat
                                key={index}
                                customInput={TextField}
                                thousandSeparator
                                defaultValue={item}
                                allowLeadingZeros={false}
                                fullWidth
                                style={{ marginBottom: "15px" }}
                                disabled={true}
                            />
                        ))}
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Typography variant="h5" style={{ textAlign: "center", marginBottom: "5px" }}>Chi phí thực tế</Typography>
                        {expectedCurrencyArray.map((item, index) => (
                            <NumberFormat
                                key={index}
                                customInput={TextField}
                                thousandSeparator
                                error={availableError[index]}
                                helperText={availableError[index] && "Vui lòng nhập giá trị (thực tế < dự kiến)"}
                                defaultValue={step[index]?.CPTT || 0}
                                onChange={(e) => handleChangeCurrency(e, index)}
                                allowLeadingZeros={false}
                                fullWidth
                                style={{ marginBottom: "15px" }}
                            />
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose}>
                    Đóng
                </Button>
                <Button color="primary" autoFocus type="submit" variant="contained" onClick={handleApprove} disabled={disabledButton}>
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ModalApproveCurrency
