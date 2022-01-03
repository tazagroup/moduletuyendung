import React, { Fragment, useState } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateCandidate, updateFlagCandidate } from 'app/store/fuse/candidateSlice';
//MUI
import { Tooltip, Menu, MenuItem, FormControl, Select } from '@mui/material';
import { NestedMenuItem } from 'mui-nested-menu'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from '@mui/icons-material/Circle';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import { AiOutlineFileWord, AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai"
import { styled } from "@mui/material/styles"
//COMPONENTS
import ModalBeforeSubmitting from './ModalBeforeSubmiting';
import ViewFile from './ViewFile';
//API
import candidatesAPI from 'api/candidatesAPI';
import noticesAPI from 'api/noticesAPI'
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: 1em;
  `);
export const CustomStatus = ({ item, field }) => {
    const dispatch = useDispatch()
    const flagCandidate = useSelector(state => state.fuse.candidates.flagCandidate)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (e) => {
        if (item === 0) {
            setAnchorEl(e.currentTarget)
        }
    }
    const handleClose = (e) => {
        setAnchorEl(null)
    }
    //RENDER STATUS
    const checkStatus = (status) => {
        let variable;
        if (status == 0) variable = <HourglassFullIcon className="icon__table__candidate pending" onClick={handleOpen} />
        else if (status == 1) variable = <CheckCircleIcon className="icon__table__candidate success" />
        else variable = <CancelIcon className="icon__table__candidate warning" />
        return (
            <TextTooltip title={status != 0 ? (status == 1 ? "Đã duyệt" : "Từ chối") : "Chờ xử lí"}>
                {variable}
            </TextTooltip>
        )
    }
    const handleApprove = async () => {
        const flag = JSON.parse(flagCandidate['XacnhanHS'])
        const newStatus = {
            Duyet: field == "Duyet" ? 1 : flag?.Duyet,
            XNPV: field == "XNPV" ? 1 : 0
        }
        const bodyData = {
            ...flagCandidate,
            XacnhanHS: JSON.stringify(newStatus)
        }
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        dispatch(updateCandidate(response.data))
        handleClose();
    }
    const handleDeny = async () => {
        console.log("OK")
    }
    return (
        <Fragment>
            {checkStatus(item)}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleApprove}>Duyệt</MenuItem>
                <MenuItem onClick={handleDeny}>Từ chối</MenuItem>
            </Menu>
        </Fragment>
    )
}

export const CustomCV = ({ item }) => {
    var arrStr = item.split('%2F')[1].split('?alt')[0]
    const type = arrStr.split('.')[1]
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <Fragment>
            <TextTooltip title="XEM CV">
                <div onClick={() => { setIsOpen(true) }}>
                    {type !== "docx" ? (type === "xlsx" ? <AiOutlineFileExcel className="excel__file" /> : <AiOutlineFilePdf className="ppt__file" />) : <AiOutlineFileWord className="word__file" />}
                </div>
            </TextTooltip>
            {isOpen && <ViewFile open={isOpen} item={item} type={type} handleClose={() => { setIsOpen(false) }} />}
        </Fragment>
    )
}

//CUSTOM STEP
export const CustomExperts = ({ item, field }) => {
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("profile"))
    const valueStep = JSON.parse(item.DuyetHS)[`${field}`]?.Trangthai
    const users = useSelector(state => state.fuse.tickets.users)
    const position = useSelector(state => state.fuse.tickets.position)
    const currentEdit = useSelector(state => state.fuse.candidates.flagCandidate)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [isEditing, setIsEditing] = useState(false)
    const [censor, setCensor] = useState(null)
    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = (e) => {
        setAnchorEl(null)
    }
    const getPositionById = (id) => {
        return position.find(opt => opt.id == id)?.Thuoctinh || "TEST"
    }
    //RENDER STATUS
    const checkStatus = (status) => {
        let variable;
        if (status == 0) variable = <HourglassFullIcon className="icon__table__candidate pending" onClick={handleOpen} />
        else if (status == 1) variable = <CheckCircleIcon className="icon__table__candidate success" />
        else variable = <CancelIcon className="icon__table__candidate warning" />
        return (
            <TextTooltip title={status != 0 ? (status == 1 ? "Đã duyệt" : "Từ chối") : "Chờ xử lí"}>
                {variable}
            </TextTooltip>
        )
    }
    const handleApprove = async (e) => {
        const name = e.target.innerText.split(/[()]/)[0].slice(0, -1)
        const censor = users.find(opt => opt.name == name)
        setCensor(censor)
        if (field != "DuyetQL") {
            setIsEditing(true)
        }
        else {
            const DuyetHS = JSON.parse(currentEdit.DuyetHS)
            DuyetHS.DuyetQL.Trangthai = 1
            const newValue = {
                ...DuyetHS,
                DuyetTD: { Trangthai: 0, Nguoiduyet: censor.id, step: 0 }
            }
            const bodyData = {
                ...currentEdit,
                DuyetHS: JSON.stringify(newValue)
            }
            const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
            dispatch(updateCandidate(response.data))
        }
        handleClose();
    }
    const checkApprove = (option) => {
        const flag = Object.keys(JSON.parse(item.DuyetHS))
        if (flag.length == 1) {
            return Array.isArray(option.PQTD) ? option.PQTD.includes(5) : option.PQTD == 5
        }
        else {
            return Array.isArray(option.PQTD) ? option.PQTD.includes(2) : option.PQTD == 2
        }

    }
    const handleDeny = async (e) => {
        handleClose()
        let DuyetHS = JSON.parse(currentEdit.DuyetHS)
        let DanhgiaHS = JSON.parse(currentEdit.DanhgiaHS)
        let censor = null;
        if (field == "DuyetSPV") {
            DuyetHS = {}
            DanhgiaHS = {}
        }
        else if (field == "DuyetQL") {
            censor = DuyetHS.DuyetSPV.Nguoiduyet
            DuyetHS = {
                DuyetSPV: { ...DuyetHS.DuyetSPV, Trangthai: 0 },
            }
            delete DuyetHS.DuyetQL
        }
        const bodyData = {
            ...currentEdit,
            DuyetHS: JSON.stringify(DuyetHS),
            DanhgiaHS: JSON.stringify(DanhgiaHS)
        }
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        dispatch(updateCandidate(response.data))
        if (censor) {
            const noticeData = {
                "idGui": user.profile.id,
                "idNhan": censor,
                "idModule": 4,
                "Loai": 1,
                "Noidung": response.data.attributes.key,
                "idTao": user.profile.id
            }
            noticesAPI.postNotice(noticeData)
        }
    }
    //RETURN JSX
    return (
        <Fragment>
            {checkStatus(valueStep)}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <NestedMenuItem
                    label={"Phê duyệt"}
                    parentMenuOpen={open}
                >
                    {users.filter(checkApprove).map(item => (
                        <MenuItem key={item.id} onClick={handleApprove}>{`${item.name} ( ${getPositionById(item.position)} )`}</MenuItem>
                    ))}
                </NestedMenuItem>
                <MenuItem onClick={handleDeny}>Từ chối</MenuItem>
            </Menu>
            {
                isEditing &&
                <ModalBeforeSubmitting
                    open={isEditing}
                    handleClose={() => { setIsEditing(false) }}
                    item={item}
                    censor={censor}
                />
            }
        </Fragment>
    )
}

export const CustomTimeline = ({ item }) => {
    const dispatch = useDispatch()
    const currentStep = JSON.parse(item.DuyetHS).DuyetTD.step
    console.log(currentStep)
    const currentStatus = JSON.parse(item.DuyetHS).DuyetTD.Trangthai
    const steps = [
        "Nhận kết quả.Gửi thư mời làm việc / thư cảm ơn quản lí cấp cao",
        "Gửi mail duyệt thư mời làm việc",
        "Gửi thư mời ứng viên",
        "Xác nhận ngày làm việc chính thức, báo bộ phận yêu cầu tuyển dụng"
    ]
    const handleUpdateStep = async (step) => {
        console.log(currentStep)
        let flag = step + 1
        if (step < currentStep && step == 0) {
            flag = 0
        }
        if (currentStatus != 1) {
            const newDuyetTD = {
                ...JSON.parse(item.DuyetHS).DuyetTD,
                Trangthai: step == 3 ? 1 : 0,
                step: flag
            }
            const newDuyetHS = {
                ...JSON.parse(item.DuyetHS),
                DuyetTD: newDuyetTD
            }
            const bodyData = {
                ...item,
                DuyetHS: JSON.stringify(newDuyetHS)
            }
            const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
            dispatch(updateCandidate(response.data))
        }
    }
    return (
        <>
            <div style={{ display: "flex", gap: "0 10px" }}>
                {steps.map((item, index) => (
                    <TextTooltip title={item} key={index}>
                        <div onClick={() => { handleUpdateStep(index) }}>
                            {currentStep == index ? <CircleTwoToneIcon className="custom__timeline process" /> : currentStep > index ? <CheckCircleIcon className="custom__timeline success" /> : <CircleIcon className="custom__timeline pending" />}
                        </div>
                    </TextTooltip>
                ))}
            </div>
        </>
    )
}

export const CustomSelect = (props) => {
    const source = useSelector(state => state.fuse.tickets.source)
    const arrayCandidate = useSelector(state => state.fuse.candidates.dataCandidate)
    const mainSource = arrayCandidate.map(item => source.find(opt => opt.id == JSON.parse(item.Profile).Nguon)?.Thuoctinh)
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: props.width
            }
        }
    };
    const value = props.columnDef.tableData.filterValue || []
    const countProperty = (item) => {
        return mainSource.filter(opt => opt == item).length
    }
    return (
        <>
            <FormControl sx={{ m: 1, width: 150, marginTop: "15.5px" }} variant="standard">
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={value}
                    onChange={(event) => {
                        const { target: { value } } = event;
                        props.onFilterChanged(props.columnDef.tableData.id, value);
                    }}
                    renderValue={(selected) => {
                        return selected.map(item => source.find(opt => opt.id == item).Thuoctinh).join(', ')
                    }}
                    MenuProps={MenuProps}
                >
                    {mainSource.map((item, index) => (
                        <MenuItem key={index} value={source.find(opt => opt.Thuoctinh == item).id} style={{ fontSize: "15px" }}>{`${item} (${countProperty(item)}) `}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}