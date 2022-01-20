import React, { Fragment, useState } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateCandidate, updateFlagCandidate } from 'app/store/fuse/candidateSlice';
import { openDialog } from 'app/store/fuse/dialogSlice';
//MUI
import { Menu, MenuItem, FormControl, Select } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { NestedMenuItem } from 'mui-nested-menu'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from '@mui/icons-material/Circle';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AiOutlineFileWord, AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai"
import { styled } from "@mui/material/styles"
//COMPONENTS
import ModalBeforeSubmitting from './ModalBeforeSubmiting';
import ModalDeny from './ModalDeny'
import ViewFile from './ViewFile';
//API
import candidatesAPI from 'api/candidatesAPI';
import noticesAPI from 'api/noticesAPI'
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: 1em;
  `);
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: 12,
        border: '1px solid #dadde9',
    },
}));
export const CustomStatus = ({ item, field, censor }) => {
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("profile"))
    let users = useSelector(state => state.fuse.tickets.users)
    users = users.filter(opt => opt.PQTD)
    const position = useSelector(state => state.fuse.tickets.position)
    const flagCandidate = useSelector(state => state.fuse.candidates.flagCandidate)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const getPositionById = (id) => {
        return position.find(opt => opt.id == id)?.Thuoctinh || "TEST"
    }
    const handleOpen = (e) => {
        const canEdit = (field == "Duyet") ? user.profile.PQTD.includes(1) : user.profile.PQTD.includes(2)
        if (item === 0 && (user.profile.id == censor)) {
            setAnchorEl(e.currentTarget)
        }
    }
    const handleClose = (e) => {
        setAnchorEl(null)
    }
    //RENDER STATUS
    const checkStatus = (status, censor) => {
        let variable;
        let name = users.find(opt => opt.id == censor).name
        if (status == 0) variable = <HourglassFullIcon className="icon__table__candidate pending" onClick={handleOpen} />
        else if (status == 1) variable = <CheckCircleIcon className="icon__table__candidate success" />
        else variable = <CancelIcon className="icon__table__candidate warning" />
        return (
            <TextTooltip title={status != 0 ? (status == 1 ? "Đã duyệt" : "Từ chối") : `Chờ xử lí:${name}`}>
                {variable}
            </TextTooltip>
        )
    }
    const handleApprove = async (e) => {
        var censor = ""
        if (field == "Duyet") {
            censor = e.target.innerText.split(/[()]/)[0].slice(0, -1)
        }
        const flag = JSON.parse(flagCandidate['XacnhanHS'])
        const newStatus = {
            Duyet: field == "Duyet" ? { ...flag.Duyet, status: 1 } : flag?.Duyet,
            XNPV: field == "XNPV" ? { ...flag.XNPV, status: 1 } : { Nguoiduyet: users.find(opt => opt.name == censor).id, status: 0 }
        }
        const bodyData = {
            ...flagCandidate,
            XacnhanHS: JSON.stringify(newStatus)
        }
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        dispatch(updateCandidate(response.data))
        dispatch(updateFlagCandidate(bodyData))
        handleClose()
        if (field == "Duyet") {
            const noticeData = {
                "idGui": user.profile.id,
                "idNhan": users.find(opt => opt.name == censor).id,
                "idModule": 4,
                "Loai": 1,
                "Noidung": JSON.stringify({ id: bodyData.key, text: "Bước 3", step: "Xác nhận phỏng vấn" }),
                "idTao": user.profile.id
            }
            noticesAPI.postNotice(noticeData)
        }
    }
    const handleDeny = async () => {
        handleClose()
        dispatch(openDialog({
            children: <ModalDeny item={flagCandidate} field={field} />
        }))
    }
    return (
        <Fragment>
            {checkStatus(item, censor)}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {field == "Duyet" ? (
                    <NestedMenuItem
                        label={"Duyệt"}
                        parentMenuOpen={open}
                    >
                        {users.filter(opt => opt?.PQTD.includes(2)).map(item => (
                            <MenuItem key={item.id} onClick={handleApprove}>{`${item.name} ( ${getPositionById(item.position)} )`}</MenuItem>
                        ))}
                    </NestedMenuItem>
                ) : (
                    <MenuItem onClick={handleApprove}>Duyệt</MenuItem>
                )}
                <MenuItem onClick={handleDeny}>Từ chối</MenuItem>
            </Menu>
        </Fragment>
    )
}
// CUSTOM CV 
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
    const censorStep = JSON.parse(item.DuyetHS)[`${field}`]?.Nguoiduyet
    const users = useSelector(state => state.fuse.tickets.users)
    const position = useSelector(state => state.fuse.tickets.position)
    const currentEdit = useSelector(state => state.fuse.candidates.flagCandidate)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [isEditing, setIsEditing] = useState(false)
    const [censor, setCensor] = useState(null)
    const handleOpen = (e) => {
        const specializeCondition = (field == "DuyetSPV") ? user.profile.PQTD.includes(1) : false
        const manageCondition = (field == "DuyetQL") ? user.profile.PQTD.includes(5) : false
        const canEditCondition = user.profile.id == censorStep
        if (canEditCondition && specializeCondition || manageCondition) {
            setAnchorEl(e.currentTarget)
        }
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
            //NOTICES
            const noticeData = {
                "idGui": user.profile.id,
                "idNhan": censor.id,
                "idModule": 4,
                "Loai": 1,
                "Noidung": JSON.stringify({ id: bodyData.key, text: "Bước 8", step: "Trả kết quả" }),
                "idTao": user.profile.id
            }
            noticesAPI.postNotice(noticeData)
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
        let mainText = ""
        let mainStep = ""
        if (field == "DuyetSPV") {
            DuyetHS = {}
            DanhgiaHS = {}
        }
        else if (field == "DuyetQL") {
            censor = DuyetHS.DuyetSPV.Nguoiduyet
            DuyetHS = {
                DuyetSPV: { ...DuyetHS.DuyetSPV, Trangthai: 0 },
            }
            mainText = "Bước 6"
            mainStep = "Đánh giá, duyệt sau phỏng vấn."
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
                "Noidung": JSON.stringify({ id: bodyData.key, text: mainText, step: mainStep }),
                "idTao": user.profile.id
            }
            noticesAPI.postNotice(noticeData)
        }
    }
    return (
        <Fragment>
            {checkStatus(valueStep)}
            {valueStep == 0 && (
                <CustomTooltip title={`${users.find(opt => opt.id == censorStep)?.name}`}>
                    <AccountCircleIcon />
                </CustomTooltip>
            )}
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
    const user = JSON.parse(localStorage.getItem("profile"))
    const users = useSelector(state => state.fuse.tickets.users)
    const censorStep = JSON.parse(item.DuyetHS).DuyetTD.Nguoiduyet
    const currentStep = JSON.parse(item.DuyetHS).DuyetTD.step
    const currentStatus = JSON.parse(item.DuyetHS).DuyetTD.Trangthai
    const steps = [
        "Nhận kết quả.Gửi thư mời làm việc / thư cảm ơn quản lí cấp cao",
        "Gửi mail duyệt thư mời làm việc",
        "Gửi thư mời ứng viên",
        "Xác nhận ngày làm việc chính thức, báo bộ phận yêu cầu tuyển dụng"
    ]
    const name = users.find(opt => opt.id == censorStep).name
    const handleUpdateStep = async (step) => {
        if (censorStep == user.profile.id) {
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
                    DuyetHS: JSON.stringify(newDuyetHS),
                    Trangthai: step == 3 ? 1 : 0,
                }
                const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
                dispatch(updateFlagCandidate(bodyData))
                dispatch(updateCandidate(response.data))
            }
        }
    }
    return (
        <>
            <div style={{ display: "flex", gap: "0 10px", marginTop: 22 }}>
                {steps.map((item, index) => (
                    <TextTooltip title={item} key={index}>
                        <div onClick={() => { handleUpdateStep(index) }}>
                            {currentStep == index ? <CircleTwoToneIcon className="custom__timeline process" /> : currentStep > index ? <CheckCircleIcon className="custom__timeline success" /> : <CircleIcon className="custom__timeline pending" />}
                        </div>
                    </TextTooltip>
                ))}
            </div>
            <CustomTooltip title={`${users.find(opt => opt.id == censorStep).name}`}>
                <AccountCircleIcon />
            </CustomTooltip>
        </>
    )
}

export const CustomSelect = (props) => {
    const source = useSelector(state => state.fuse.tickets.source)
    const arrayCandidate = useSelector(state => state.fuse.candidates.dataCandidate)
    const mainSource = [...new Set(arrayCandidate.map(item => source.find(opt => opt.id == JSON.parse(item.Profile).Nguon)?.Thuoctinh))]
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
        const flag = arrayCandidate.map(item => source.find(opt => opt.id == JSON.parse(item.Profile).Nguon)?.Thuoctinh)
        return flag.filter(opt => opt == item).length
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