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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
  const [value, setValue] = React.useState(0)
  const time = new Date(item[`ThoigianPV`])
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const getNameById = (id) => {
    return users.find(item => item.id == id)?.name
  }
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Phỏng vấn vòng 1"
        titleTypographyProps={{ variant: 'h5' }}
      />
      <CardContent>
        <Typography sx={{ fontSize: 15 }} color="text.secondary">
          Thời gian : {time.toLocaleDateString("en-GB")} - {time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}
        </Typography>
        <Typography sx={{ fontSize: 15 }} color="text.secondary">
          Người phỏng vấn : {getNameById(item.Nguoiduyet)}
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
                <MenuItem value={1}>Đạt</MenuItem>
                <MenuItem value={0}>Đang xử lí</MenuItem>
                <MenuItem value={-1}>Không đạt</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%", mt: 5 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Google Maps"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
              <DirectionsIcon />
            </IconButton>
          </Paper> */}
        </CardContent>
      </Collapse>
    </Card>
  );
}