import React, { useState } from 'react'
//REDUX
import { useSelector, useDispatch, batch } from "react-redux"
import { updateDataGuide } from "app/store/fuse/guideSlice"
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { styled } from "@mui/material/styles"
import { DialogActions, DialogTitle, DialogContent, IconButton, Tooltip, Grid, TextField, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutlined';
//COMPONENTS
import SelectField from "../CustomField/SelectField"
//API
import guideAPI from 'api/guideAPI'
const ModalEdit = ({ title, link, id, idGuide }) => {
    const dispatch = useDispatch()
    const dataGuide = useSelector(state => state.fuse.guides.dataGuide)
    const [titleValue, setTitleValue] = useState(title)
    const [linkValue, setLinkValue] = useState(link)
    const handleSubmit = async () => {
        const item = dataGuide.find(opt => opt.id == idGuide)
        const itemContent = JSON.parse(item.Noidung)
        itemContent[id] = {
            ...itemContent[id],
            Step: titleValue,
            Lienket: linkValue,
        }
        const bodyData = {
            ...item,
            Noidung: JSON.stringify(itemContent)
        }
        const response = await guideAPI.updateGuide(bodyData, bodyData.id)
        dispatch(updateDataGuide(response.data.attributes))
        dispatch(closeDialog())
    }
    return (
        <React.Fragment>
            <DialogTitle>Sửa hướng dẫn</DialogTitle>
            <CloseIcon
                style={{ cursor: "pointer", position: "absolute", top: "20px", right: "20px" }}
                onClick={() => { dispatch(closeDialog()) }}
            />
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            id="outlined-basic"
                            value={titleValue}
                            label="Tiêu đề"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => { setTitleValue(e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="outlined-basic"
                            value={linkValue}
                            label="Liên kết"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => { setLinkValue(e.target.value) }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" autoFocus type="submit" variant="contained" size="large" onClick={handleSubmit}>
                    Cập nhật
                </Button>
            </DialogActions>
        </React.Fragment>
    )
}

export default ModalEdit
