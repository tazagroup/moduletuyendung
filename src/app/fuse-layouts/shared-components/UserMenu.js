import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';


function UserMenu(props) {
  const dispatch = useDispatch();
  const history = useHistory()
  const user = JSON.parse(localStorage.getItem("profile"))
  const [userMenu, setUserMenu] = useState(null);
  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };
  const userMenuClose = () => {
    setUserMenu(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("profile")
    history.push('/dang-nhap')
  }
  return (
    <>
      <Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick}>
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user?.profile.Hoten}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="textSecondary">
            Nhân viên
          </Typography>
        </div>
        <Avatar className="md:mx-4">{user?.profile.Hoten.split(" ").slice(-1)[0].charAt(0)}</Avatar>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        <>
          <MenuItem component={Link} to="/pages/profile" onClick={userMenuClose} role="button">
            <ListItemIcon className="min-w-40">
              <Icon>account_circle</Icon>
            </ListItemIcon>
            <ListItemText primary="Tài khoản" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleLogout();
              userMenuClose();
            }}
          >
            <ListItemIcon className="min-w-40">
              <Icon>exit_to_app</Icon>
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </MenuItem>
        </>
      </Popover>
    </>
  );
}

export default UserMenu;
