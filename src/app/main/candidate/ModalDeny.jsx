import React, { useState, useRef } from 'react'
//REDUX
import { useDispatch, useSelector, batch } from 'react-redux';
import { updateCandidate, updateFlagCandidate } from 'app/store/fuse/candidateSlice'
import { closeDialog } from 'app/store/fuse/dialogSlice';
//MUI
import Button from "@mui/material/Button"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Grid from "@mui/material/Grid"
import FormControl from "@mui/material/FormControl"
import InputLabel from '@mui/material/InputLabel'
import TextareaAutosize from '@mui/material/TextareaAutosize';
//COMPONENTS
import SweetAlert from 'react-bootstrap-sweetalert';
//API
import candidatesAPI from 'api/candidatesAPI'
import guidesAPI from 'api/guideAPI'
const ModalDeny = ({ item, field }) => {
    const dispatch = useDispatch()
    const [reason, setReason] = useState('')
    const textReason = useRef('')
    const labels = useSelector(state => state.fuse.guides.dataReason)
    const handleConfirm = async () => {
        const flag = JSON.parse(item['XacnhanHS'])
        const XacnhanHS = {
            Duyet: field == "Duyet" ? { ...flag.Duyet, status: 2 } : flag?.Duyet,
            XNPV: field == "XNPV" ? { ...flag.XNPV, status: 2 } : flag?.XNPV
        }
        const bodyData = {
            ...item,
            Lydo: JSON.stringify({ id: labels.find(opt => opt.Thuoctinh == reason).id, text: textReason.current.value }),
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
                                style={{ fontSize: "15px", marginBottom: 15 }}
                            >
                                {labels && labels.map((item, index) => (
                                    <MenuItem key={index} value={item.Thuoctinh}>{item.Thuoctinh}</MenuItem>
                                ))}
                            </Select>
                            <TextareaAutosize
                                ref={textReason}
                                aria-label="empty textarea"
                                placeholder="Lý do từ chối"
                                style={{ width: "100%", border: "1px solid #cdcdcd", padding: "10px 15px", borderRadius: 5 }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </SweetAlert>
        </React.Fragment >
    )
}

export default ModalDeny
