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
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: .8em;
  `);
const ModalCreate = () => {
    const dispatch = useDispatch()
    const dataGuide = useSelector(state => state.fuse.guides.dataGuide)
    const dataSetting = useSelector(state => state.fuse.guides.dataSetting)
    const [guideList, setGuideList] = useState([{ Step: "", Lienket: "" }]);
    const [subSourceArray, setSubSourceArray] = useState([])
    const [idModule, setIdModule] = useState("")
    const idArray = dataGuide.map(item => item.idModule)
    const sourceArray = dataSetting.map(item => item.Thuoctinh)
    const handleAddSource = (e) => {
        setGuideList([...guideList, { Step: "", Lienket: "" }]);
    }
    const handleRemoveSource = (index) => {
        const list = [...guideList];
        list.splice(index, 1);
        setGuideList(list);
    }
    const handleChangeTitle = (e, index) => {
        const { value } = e.target;
        const list = [...guideList]
        list[index]['Step'] = value
        setGuideList(list)
    }
    const handleChangeLink = (e, index) => {
        const { value } = e.target;
        const list = [...guideList]
        list[index]['Lienket'] = value
        setGuideList(list)
    }
    const handleChangeModule = (e) => {
        setIdModule(e.target.value)
        const flag = [...subSourceArray]
        if (flag.length == 0) {
            flag.push(e.target.value)
        }
        else {
            flag[0] = e.target.value
        }
        setSubSourceArray(flag)
    }
    const handleSubmit = async (e) => {
        const idMain = dataSetting.find(opt => opt.Thuoctinh == idModule).id
        if (idArray.includes(idMain)) {
            const main = dataGuide.find(item => item.idModule == idMain)
            const content = JSON.parse(main.Noidung)
            const result = content.concat(guideList).map((item, index) => {
                delete item.id
                return {
                    id: index,
                    ...item
                }
            })
            const bodyData = {
                ...main,
                Noidung: JSON.stringify(result)
            }
            const response = await guideAPI.updateGuide(bodyData, bodyData.id)
            batch(() => {
                dispatch(updateDataGuide(response.data.attributes))
                dispatch(closeDialog())
            })
        }
    }
    return (
        <React.Fragment>
            <DialogTitle>Tạo hướng dẫn</DialogTitle>
            <CloseIcon
                style={{ cursor: "pointer", position: "absolute", top: "20px", right: "20px" }}
                onClick={() => { dispatch(closeDialog()) }}
            />
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <SelectField
                            label="Chức năng" value={idModule} arrayItem={sourceArray}
                            handleChange={(e) => handleChangeModule(e)}
                            arraySubItem={subSourceArray}
                        />
                    </Grid>
                    {guideList.length != 0 && guideList.map((item, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" value={item.Step} label="Tiêu đề" variant="outlined" fullWidth onChange={(e) => handleChangeTitle(e, index)} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="outlined-basic" value={item.Lienket} label="Liên kết" variant="outlined" fullWidth onChange={(e) => handleChangeLink(e, index)} />
                            </Grid>
                            <Grid item xs={12}>
                                {guideList.length !== 1 && <TextTooltip title="Xóa nguồn">
                                    <IconButton onClick={() => { handleRemoveSource(index) }} style={{ marginTop: "16px" }}>
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </TextTooltip>}
                                <TextTooltip title="Thêm nguồn">
                                    <IconButton onClick={handleAddSource} style={{ marginTop: "16px" }}>
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </TextTooltip>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" autoFocus type="submit" variant="contained" size="large" onClick={handleSubmit}>
                    Đăng hướng dẫn
                </Button>
            </DialogActions>
        </React.Fragment>
    )
}

export default ModalCreate
