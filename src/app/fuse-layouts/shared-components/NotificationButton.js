import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { setDataNotice, updateNotice } from "app/store/fuse/noticesSlice"
//MUI
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { IconButton, Menu, MenuItem, List, Badge, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
//API
import noticesAPI from 'api/noticesAPI'
const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "red",
        color: "red",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },

}));
const NotificationButton = () => {
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("profile"))
    const dataNotice = useSelector(state => state.fuse.notices.dataNotice)
    const renderNotice = dataNotice.filter(item => item.attributes.Dadoc == 0)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [settings, setSettings] = React.useState([])
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        if (dataNotice.length != 0) {
            setAnchorEl(e.currentTarget);
        }
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
        const handleUpdate = async (e) => {
            const bodyData = {
                ...main,
                Dadoc: 1
            }
            const response = await noticesAPI.updateNotice(bodyData)
            dispatch(updateNotice(response.data))
            setAnchorEl(null)
        }
        const linkURL = `${settings.find(item => item.id == main.idModule)?.Link}/?id=${main.Noidung}`
        return (<MenuItem onClick={handleUpdate}>
            <List
                sx={{ width: "400px", overflow: "hidden" }}
                component="div"
                aria-labelledby="nested-list-subheader"
            >
                <div style={{ display: "flex", gap: "0 35px", alignItems: "center" }}>
                    {main.Dadoc == 0 ? <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                    >
                        <Avatar>{user?.profile.Hoten.split(" ").slice(-1)[0].charAt(0)}</Avatar>
                    </StyledBadge> : <Avatar>{user?.profile.Hoten.split(" ").slice(-1)[0].charAt(0)}</Avatar>}
                    <p style={{ minWidth: "80px" }}>{settings.find(item => item.id == main.idModule)?.Thuoctinh}</p>
                    <Link to={{ pathname: linkURL }} style={{ minWidth: "50px" }}>{`#${main.Noidung}`}</Link>
                    <p>{new Date(`${main.Ngaytao}`).toLocaleString("en-GB")}</p>
                </div>
            </List>
        </MenuItem>)
    }
    return (
        <>
            <IconButton onClick={handleClick}>
                <Badge badgeContent={dataNotice.length == 0 ? 0 : renderNotice.length} color="error">
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
