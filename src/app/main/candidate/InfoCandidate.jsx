import React, { useState, useEffect, Fragment } from 'react'
//REDUX
import { useSelector, useDispatch } from "react-redux"
import { updateCandidate, updateFlagCandidate } from "app/store/fuse/candidateSlice"
import { openDialog } from 'app/store/fuse/dialogSlice';
//MUI
import { makeStyles, TextField } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, FormControl, Autocomplete, IconButton, InputLabel, Select, MenuItem } from '@mui/material';
import { Grid, Typography } from '@mui/material';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
//COMPONENTS
import InputField from "../CustomField/InputField"
import DateField from '../CustomField/DateField';
import Tinymce from '../CustomField/Tinymce'
import NumberFormat from "react-number-format"
import CardCalendar from "./CardCalendar"
import CreateCalendar from "./CreateCalendar"
import ViewFile from './ViewFile'
import ModalDeny from './ModalDeny';
//FORM
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
//API
import candidatesAPI from 'api/candidatesAPI'

const useStyles = makeStyles({
    field: {
        marginTop: "15px !important"
    },
    field2: {
        marginTop: "5px !important"
    },
    title: {
        width: "100%",
        textAlign: "center",
        fontSize: "25px !important",
        fontWeight: "bold !important"
    },
    icon: {
        position: "absolute",
        right: "20px",
        top: "20px",
        cursor: "pointer"
    },
    sub__title: {
        fontWeight: "bold !important"
    }
})
const emptyTinymce = "<p>- Kiến thức</p>\n<ul>\n<li>&nbsp;</li>\n</ul>\n<p>- Kĩ năng</p>\n<ul>\n<li>&nbsp;</li>\n</ul>\n<p>- Th&aacute;i độ</p>\n<ul>\n<li>&nbsp;</li>\n</ul>\n<p>&nbsp;</p>"
const schema = yup.object().shape({
    Hoten: yup.string().required("Vui lòng nhập tên ứng viên"),
    Email: yup.string().email("Vui lòng nhập đúng định dạng").required("Vui lòng nhập tên ứng viên"),
    Phone: yup.string().required("Vui lòng nhập số điện thoại"),
});
const InfoCandidate = ({ open, handleClose }) => {
    const flagCandidate = useSelector(state => state.fuse.candidates.flagCandidate)
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const position = useSelector(state => state.fuse.tickets.position)
    const user = JSON.parse(localStorage.getItem("profile"))
    const profile = JSON.parse(flagCandidate.Profile)
    const dispatch = useDispatch()
    const classes = useStyles()
    const form = useForm({
        defaultValues: {
            Hoten: profile.Hoten,
            Email: profile.Email || "",
            Phone: profile.Phone ? profile.Phone : "",
        },
        mode: 'all',
        resolver: yupResolver(schema),
    });
    //STATE
    const [tickets, setTickets] = useState([])
    const [ticket, setTicket] = useState({})
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isCreating, setIsCreating] = useState(false)
    const [isViewing, setIsViewing] = useState(false)
    const calendar = JSON.parse(flagCandidate.LichPV)
    const [firstRate, setFirstRate] = useState(calendar?.Danhgia || emptyTinymce)
    const [point, setPoint] = useState(calendar?.Diem || 0)
    const [note, setNote] = useState(calendar?.Ghichu || '')
    const [status, setStatus] = useState(calendar?.Trangthai || 0)
    const roundsIntern = calendar?.VongPV
    const disabledCreate = roundsIntern ? roundsIntern[roundsIntern.length - 1]?.Trangthai != 1 : false
    const disabledField = Object.keys(JSON.parse(flagCandidate.DuyetHS)).length != 0 || flagCandidate.Trangthai == 2
    const disabledBasicInfo = JSON.parse(flagCandidate.XacnhanHS).Duyet.status == 1
    const isApproved = JSON.parse(flagCandidate.XacnhanHS)?.XNPV
    const secondStep = roundsIntern ? roundsIntern[1]?.Trangthai == 1 : false
    const judgement = JSON.parse(flagCandidate.DanhgiaHS)
    const checkJudgement = Object.keys(JSON.parse(flagCandidate.DanhgiaHS)).length != 0
    //FUNCTIONS 
    const getPositionById = (id) => {
        return position.find(item => item.id == id)?.Thuoctinh
    }
    useEffect(async () => {
        //GET THE CURRENT TICKETS
        const tickets = dataTicket.filter(item => item.Trangthai == 2)
        const flag = tickets.find(option => option.key === flagCandidate.idTicket)
        //set selected ticket
        setTicket(flag)
        setTickets(tickets)
        return () => {

        }
    }, [])
    const handleTicketChange = (e, newValue) => {
        setTicket(newValue)
    }
    const handleChangeStatus = (e) => {
        setStatus(e.target.value)
        if (e.target.value == 2) {
            dispatch(openDialog({
                children: <ModalDeny item={flagCandidate} field="DuyetHS" />
            }))
        }
    }
    const handleEditCandidate = async (e) => {
        // Upload Candidate
        const newProfile = {
            ...profile,
            Hoten: e.Hoten,
            Email: e.Email,
            Phone: e.Phone,
        }
        //If edit  the ticket's status
        const DuyetHS = !status ? JSON.parse(flagCandidate.DuyetHS) : ([2, 3].includes(status) ? flagCandidate.DuyetHS : { DuyetSPV: { Nguoiduyet: user.profile.id, Trangthai: 0 } })
        const LichPV = !secondStep ? JSON.parse(flagCandidate.LichPV) : {
            ...JSON.parse(flagCandidate.LichPV),
            Danhgia: firstRate,
            Diem: point,
            Ghichu: note,
            Trangthai: status
        }
        const Trangthai = !secondStep ? flagCandidate.Trangthai : [2, 3].includes(status) ? status : 0
        const bodyData = {
            ...flagCandidate,
            idTicket: ticket.key,
            Profile: newProfile,
            DuyetHS: JSON.stringify(DuyetHS),
            LichPV: JSON.stringify(LichPV),
            Trangthai: status == 0 ? flagCandidate.Trangthai : Trangthai
        }
        const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
        dispatch(updateCandidate(response.data))
        handleClose()
    }
    return (
        <Fragment>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <form onSubmit={form.handleSubmit(handleEditCandidate)}>
                    <DialogTitle id="alert-dialog-title" className={classes.title}>Hồ sơ ứng viên </DialogTitle>
                    <DialogContent>
                        {/* Info  */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title}>Thông tin cơ bản</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField form={form} name="Hoten" label="Họ tên ứng viên" type="text" disabled={disabledBasicInfo} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField form={form} name="Email" label="Email" type="text" disabled={disabledBasicInfo} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField form={form} name="Phone" label="Số điện thoại" type="number" disabled={disabledBasicInfo} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    value={ticket}
                                    onChange={handleTicketChange}
                                    options={tickets}
                                    disabled={disabledBasicInfo}
                                    getOptionLabel={option => getPositionById(option[`Vitri`])}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option}>
                                                {getPositionById(option[`Vitri`])}
                                            </li>
                                        )
                                    }}
                                    fullWidth={true}
                                    renderInput={(params) => <TextField {...params} label={"Vị trí tuyển dụng"} variant="standard" />}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <DateField label="Ngày ứng tuyển" value={selectedDate} handleChange={setSelectedDate} disabled={disabledBasicInfo} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <NumberFormat
                                    label={"Mức lương dự kiến"}
                                    customInput={TextField}
                                    thousandSeparator
                                    value={ticket?.LuongDK || ''}
                                    allowLeadingZeros={false}
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                        </Grid>
                        {/* Calendar */}
                        <Grid container spacing={2} className={classes.field}>
                            <Grid item xs={12}>
                                <Typography variant="h4" className={classes.sub__title}>
                                    Lịch phỏng vấn
                                    <IconButton size="large" onClick={() => { setIsCreating(true) }} disabled={!disabledBasicInfo || disabledCreate || disabledField || flagCandidate.Trangthai == 2 || (isApproved && isApproved.status != 1)}>
                                        <InsertInvitationIcon />
                                    </IconButton>
                                </Typography>
                            </Grid>
                            {roundsIntern && roundsIntern.map((option, index) => (
                                <Grid key={index} item xs={12} md={3}>
                                    <CardCalendar key={index} item={option} />
                                </Grid>
                            ))}
                        </Grid >
                        {secondStep &&
                            <>
                                <Grid container spacing={2} className={classes.field}>
                                    <Grid item xs={12}>
                                        <Typography variant="h4" className={classes.sub__title} style={{ marginBottom: "16px" }} >Nhận xét phỏng vấn</Typography>
                                        <Tinymce value={firstRate} onChange={(e) => { setFirstRate(e) }} label="đánh giá kiến thức" disabled={disabledField} />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} className={classes.field2}>
                                    <Grid item xs={12} md={8}>
                                        <FormControl variant="standard" fullWidth style={{ marginTop: "18px" }}>
                                            <InputLabel htmlFor="component-simple">Ghi chú</InputLabel>
                                            <Input id="component-simple" value={note} onChange={(e) => { setNote(e.target.value) }} disabled={disabledField} />
                                        </FormControl>
                                    </Grid>
                                    <Grid container item xs={4}>
                                        <Grid item xs={12} md={8}>
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginTop: "24px"
                                                }}
                                            >
                                                <Rating
                                                    name="text-feedback"
                                                    value={point}
                                                    max={10}
                                                    precision={0.5}
                                                    size="large"
                                                    disabled={disabledField}
                                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                    onChange={(e) => { setPoint(Number(e.target.value)) }}
                                                />
                                                <Box sx={{ ml: 2 }}>{point}</Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth style={{ marginTop: "10px" }}>
                                                <InputLabel id="demo-simple-select-label">Đánh giá hồ sơ</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={status}
                                                    label="Đánh giá hồ sơ"
                                                    style={{ fontSize: "15px" }}
                                                    onChange={handleChangeStatus}
                                                    disabled={disabledField}
                                                >
                                                    <MenuItem value={0} disabled></MenuItem>
                                                    <MenuItem value={1}>Đậu</MenuItem>
                                                    <MenuItem value={2}>Loại</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        }
                        {
                            checkJudgement &&
                            <>
                                <Grid container spacing={2} className={classes.field}>
                                    <Grid item xs={12}>
                                        <Typography variant="h4" className={classes.sub__title} style={{ marginBottom: "16px" }} >Thông tin khác</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <NumberFormat
                                            label={"Mức lương học việc"}
                                            customInput={TextField}
                                            thousandSeparator
                                            value={judgement?.LuongHV || ''}
                                            allowLeadingZeros={false}
                                            fullWidth
                                            disabled={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <NumberFormat
                                            label={"Mức lương thử việc"}
                                            customInput={TextField}
                                            thousandSeparator
                                            value={judgement?.LuongTV || ''}
                                            allowLeadingZeros={false}
                                            fullWidth
                                            disabled={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <NumberFormat
                                            label={"Mức lương chính thức"}
                                            customInput={TextField}
                                            thousandSeparator
                                            value={judgement?.LuongCT || ''}
                                            allowLeadingZeros={false}
                                            fullWidth
                                            disabled={true}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <DateField label="Ngày gửi thư mời" value={judgement?.GTM} handleChange={setSelectedDate} disabled={disabledField} />
                                    </Grid>
                                </Grid>
                            </>
                        }
                    </DialogContent>
                    <DialogActions style={{ paddingRight: "25px" }}>
                        <Button color="error" autoFocus type="submit" variant="contained" onClick={handleClose} size="large">
                            Đóng
                        </Button>
                        <Button color="primary" autoFocus type="submit" variant="contained" size="large" disabled={disabledField}>
                            Cập nhật hồ sơ
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            {isViewing && (
                <ViewFile
                    open={isViewing}
                    handleClose={() => { setIsViewing(false) }}
                />
            )}
            {isCreating &&
                <CreateCalendar
                    open={isCreating}
                    candidate={flagCandidate}
                    position={getPositionById(ticket.Vitri)}
                    handleClose={() => { setIsCreating(false) }} />
            }
        </Fragment>
    )
}

export default InfoCandidate
