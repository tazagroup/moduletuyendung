import React, { useState } from 'react'
//REDUX
import { useSelector, useDispatch, batch } from "react-redux"
import { updateFlagCandidate, updateCandidate } from 'app/store/fuse/candidateSlice'
import { openDialog } from 'app/store/fuse/dialogSlice';
//MUI
import { styled } from '@mui/material/styles';
import {
  Card, CardHeader, CardContent, CardActions,
  Collapse,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  FormControl,
  Select
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
//COMPONENTS
import ModalDeny from './ModalDeny'
import EditCalendar from './EditCalendar';
//API
import candidatesAPI from "api/candidatesAPI"
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function CardCalendar({ item }) {
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem("profile"))
  const users = useSelector(state => state.fuse.tickets.users)
  const currentEdit = useSelector(state => state.fuse.candidates.flagCandidate)
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState(item.Trangthai)
  const [isEditing, setIsEditing] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const time = new Date(item[`ThoigianPV`])
  const isApproved = item.Nguoiduyet == user.profile.id
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleOpen = (e) => {
    if (item.Trangthai == 0 && isApproved) {
      setAnchorEl(e.currentTarget)
    }
  }
  const handleEdit = () => {
    setAnchorEl(null)
    setIsEditing(true)
  }
  const handleDelete = async () => {
    const calendar = JSON.parse(currentEdit.LichPV)
    const index = calendar.VongPV.findIndex(item => item.id == currentEdit.id)
    calendar.VongPV.splice(index, 1)
    const newCalendar = {
      ...calendar,
      VongPV: JSON.stringify(calendar.VongPV)
    }
    const bodyData = {
      ...currentEdit,
      LichPV: JSON.stringify(calendar.VongPV.length == 0 ? {} : newCalendar)
    }
    const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
    dispatch(updateFlagCandidate(bodyData))
    setAnchorEl(null)
  }
  const handleChangeStatus = async (event) => {
    setValue(event.target.value);
    if (event.target.value == 2) {
      dispatch(openDialog({
        children: <ModalDeny item={currentEdit} field="LichPV" />
      }))
    }
    const calendar = JSON.parse(currentEdit.LichPV)
    const currentStep = {
      ...calendar.VongPV.splice(-1)[0],
      Trangthai: event.target.value
    }
    calendar.VongPV[currentStep.id] = { ...currentStep }
    const bodyData = {
      ...currentEdit,
      LichPV: JSON.stringify(calendar),
      Trangthai: event.target.value == 2 ? 2 : currentEdit.Trangthai
    }
    const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
    batch(() => {
      dispatch(updateFlagCandidate(bodyData))
      dispatch(updateCandidate(response.data))
    })
  };
  const getNameById = (id) => {
    return users.find(item => item.id == id)?.name
  }
  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={handleOpen}>
              <MoreVertIcon />
            </IconButton>
          }
          title={`Phỏng vấn vòng ${item.id + 1}`}
          titleTypographyProps={{ variant: 'h5' }}
        />
        <CardContent>
          <Typography sx={{ fontSize: 15 }} color="text.secondary">
            Thời gian : <span>{time.toLocaleDateString("en-GB")} - {time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}</span>
          </Typography>
          <Typography sx={{ fontSize: 15 }} color="text.secondary">
            Người phỏng vấn : <span>{getNameById(item.Nguoiduyet)}</span>
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div className="content-item">
              <Typography variant="h5">Ghi chú:</Typography>
              <div dangerouslySetInnerHTML={{ __html: item.Ghichu }}></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h5">Tình trạng</Typography>
              <FormControl size="small" sx={{ width: 100 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value}
                  disabled={item.Trangthai != 0 || JSON.parse(currentEdit.XacnhanHS).XNPV == 0 || !isApproved}
                  displayEmpty
                  onChange={handleChangeStatus}
                >
                  <MenuItem value={0} disabled>Đang xử lí</MenuItem>
                  <MenuItem value={1}>Đạt</MenuItem>
                  <MenuItem value={2}>Không đạt</MenuItem>
                </Select>
              </FormControl>
            </div>
          </CardContent>
        </Collapse>
      </Card>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => { setAnchorEl(null) }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>Chỉnh sửa</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
      {isEditing &&
        <EditCalendar
          open={isEditing}
          item={item}
          handleClose={() => { setIsEditing(false) }}
        />
      }
    </>
  );
}