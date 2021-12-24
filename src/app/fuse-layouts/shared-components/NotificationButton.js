import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setDataNotice } from "app/store/fuse/noticesSlice"
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { IconButton, Menu, MenuItem, List, Badge } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import noticesAPI from "api/noticesAPI"
import { Link, Redirect } from "react-router-dom"

const NotificationButton = () => {
    const dispatch = useDispatch()
    const dataNotice = useSelector(state => state.fuse.notices.dataNotice)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [settings, setSettings] = React.useState([])
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    useEffect(() => {
        let isFetching = true;
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("profile"))
            const [responseNotice, responseSetting] = await Promise.all([
                noticesAPI.getNotices(),
                noticesAPI.getSettings()
            ])
            const data = responseNotice.data.filter(item => item.attributes.idNhan == user?.profile.id) || []
            if (isFetching) {
                dispatch(setDataNotice(data))
                setSettings(JSON.parse(responseSetting.data.attributes.Dulieu))
            }
        }
        fetchData()
        return () => {
            isFetching = false
        }
    }, [])
    const NoticeItem = ({ item }) => {
        const main = item.attributes
        return (<MenuItem>
            <List
                sx={{ width: "400px", overflow: "hidden" }}
                component="div"
                aria-labelledby="nested-list-subheader"
            >
                <div style={{ display: "flex", gap: "0 35px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar>K</Avatar>
                    </div>
                    <p style={{ minWidth: "80px" }}>{settings.find(item => item.id == main.idModule)?.Thuoctinh}</p>
                    <Link to={`/ve-tuyen-dung/?id=${main.Noidung}`} style={{ minWidth: "50px" }}>{`#${main.Noidung}`}</Link>
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
