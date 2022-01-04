import React, { useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector, batch } from 'react-redux';
import { updateCandidate, updateFlagCandidate } from 'app/store/fuse/candidateSlice'
import { closeDialog } from 'app/store/fuse/dialogSlice';
//MUI
import { Button, Select, MenuItem, Grid, FormControl, InputLabel } from "@mui/material"
//COMPONENTS
import SweetAlert from 'react-bootstrap-sweetalert';
//API
import candidatesAPI from 'api/candidatesAPI'
const ModalDeny = ({ item, field }) => {
    const dispatch = useDispatch()
    const errorList = useSelector(state => state.fuse.candidates.reason)
    const labels = errorList.map(item => item.Thuoctinh)
    const [reason, setReason] = useState('')
    const handleConfirm = async () => {
        const flag = JSON.parse(item['XacnhanHS'])
        const XacnhanHS = {
            Duyet: field == "Duyet" ? 2 : flag?.Duyet,
            XNPV: field == "XNPV" ? 2 : flag?.XNPV
        }
        const bodyData = {
            ...item,
            Lydo: errorList.find(opt => opt.Thuoctinh == reason).id,
            XacnhanHS: JSON.stringify(XacnhanHS),
            LichPV: field == "XNPV" ? JSON.stringify({}) : item.LichPV,
            Trangthai: 2,
        }
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        batch(() => {
            dispatch(updateCandidate(response.data))
            dispatch(closeDialog())
        })
    }
    const handleCancel = async () => {
        if (field == "DuyetHS" || field == "LichPV") {
            const response = await candidatesAPI.updateCandidate(item, item.key)
            batch(() => {
                dispatch(updateFlagCandidate(item))
                dispatch(updateCandidate(response.data))
            })
        }
        dispatch(closeDialog())
    }
    return (
        <React.Fragment>
            <SweetAlert
                error
                title="Từ chối"
                onConfirm={handleConfirm}
                customButtons={
                    <React.Fragment>
                        <Button color="error" onClick={handleCancel} variant="contained" size="large">Hủy</Button>
                        <Button onClick={handleConfirm} variant="contained" size="large">Cập nhật</Button>
                    </React.Fragment>
                }
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Lí do từ chối</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={reason}
                                label="Lí do từ chối"
                                onChange={(e) => { setReason(e.target.value) }}
                                style={{ fontSize: "15px" }}
                            >
                                {labels && labels.map((item, index) => (
                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </SweetAlert>
        </React.Fragment >
    )
}

export default ModalDeny
