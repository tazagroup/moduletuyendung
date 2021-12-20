import React from 'react'
//REDUX
import { useSelector } from "react-redux"
//MUI
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EditCalendar from './EditCalendar';
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
  const users = useSelector(state => state.fuse.tickets.users)
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState(item.Trangthai)
  const [isEditing, setIsEditing] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const time = new Date(item[`ThoigianPV`])
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleEdit = () => {
    setAnchorEl(null)
    setIsEditing(true)
  }
  const getNameById = (id) => {
    return users.find(item => item.id == id)?.name
  }
  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
              <MoreVertIcon />
            </IconButton>
          }
          title="Phỏng vấn vòng 1"
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
            <Typography variant="h5">Đánh giá:</Typography>
            <Typography variant="body1" paragraph>
              {item.Danhgia}
            </Typography>
            <Typography variant="h5">Ghi chú:</Typography>
            <Typography variant="body1" paragraph>
              {item.Ghichu}
            </Typography>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h5">Tình trạng</Typography>
              <FormControl size="small" sx={{ width: 100 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value}
                  displayEmpty
                  onChange={handleChange}
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