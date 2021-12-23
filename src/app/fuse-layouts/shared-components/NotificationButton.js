import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setDataNotice } from "app/store/fuse/noticesSlice"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { IconButton, Menu, MenuItem, List, Badge } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import noticesAPI from "api/noticesAPI"
import { Link } from "react-router-dom"
const NotificationButton = () => {
    const dispatch = useDispatch()
    const dataNotice = useSelector(state => state.fuse.notices.dataNotice)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [settings, setSettings] = React.useState([])
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    useEffect(async () => {
        const [responseNotice, responseSetting] = await Promise.all([
            noticesAPI.getNotices(),
            noticesAPI.getSettings()
        ])
        const user = JSON.parse(localStorage.getItem("profile"))
        const data = responseNotice.data.filter(item => item.attributes.idNhan == user.profile?.id)
        dispatch(setDataNotice(data))
        setSettings(JSON.parse(responseSetting.data.attributes.Dulieu))
    }, [])
    const NoticeItem = ({ item }) => {
        const main = item.attributes
        return (<MenuItem>
            <List
                sx={{ width: "350px" }}
                component="div"
                aria-labelledby="nested-list-subheader"
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Avatar>K</Avatar>
                    <p>Tuyển dụng</p>
                    <Link to={`/ve-tuyen-dung/${main.Noidung}`}>{`#${main.Noidung}`}</Link>
                    <p>{new Date(`${main.Ngaytao}`).toLocaleString("en-GB")}</p>
                </div>
            </List>
        </MenuItem>)
    }
    return (
        <>
            <IconButton onClick={handleClick}>
                <Badge badgeContent={dataNotice.length} color="error">
                    <NotificationsActiveIcon />
                </Badge>
            </IconButton>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => { setAnchorEl(null) }}
                PaperProps={{
                    style: {
                        height: 350,
                        marginTop: "13px"
                    },
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <MenuItem>
                    <List
                        sx={{ width: "100%" }}
                        component="div"
                        aria-labelledby="nested-list-subheader"
                    >
                        <div style={{ fontWeight: "bold", textAlign: "center" }}>Thông báo</div>
                    </List>
                </MenuItem>
                {dataNotice && dataNotice.map((item, index) => (
                    <NoticeItem key={index} item={item} />
                ))}
            </Menu>
        </>

    )
}

export default NotificationButton
