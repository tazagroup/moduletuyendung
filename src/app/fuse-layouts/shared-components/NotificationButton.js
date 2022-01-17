import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { setDataNotice, updateNotice } from "app/store/fuse/noticesSlice"
import { setDataSetting } from "app/store/fuse/guideSlice"
//MUI
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { IconButton, Menu, MenuItem, List, Badge, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { AiOutlineFileExcel } from 'react-icons/ai'
//API
import noticesAPI from 'api/noticesAPI'
const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "red",
        color: "red",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },

}));
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
const NotificationButton = () => {
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("profile"))
    const settings = useSelector(state => state.fuse.guides.dataSetting)
    const dataNotice = useSelector(state => state.fuse.notices.dataNotice)
    const renderNotice = dataNotice.filter(item => item.attributes.Dadoc == 0)
    const [anchorEl, setAnchorEl] = React.useState(null);
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
                dispatch(setDataSetting(JSON.parse(responseSetting.data.attributes.Dulieu)))
            }
        }
        fetchData()
        return () => {
            isFetching = false
        }
    }, [])
    const NoticeItem = ({ item }) => {
        const main = item.attributes
        const content = JSON.parse(main.Noidung)
        const handleUpdate = async (e) => {
            const bodyData = {
                ...main,
                Dadoc: 1
            }
            const response = await noticesAPI.updateNotice(bodyData)
            dispatch(updateNotice(response.data))
            setAnchorEl(null)
        }
        const linkURL = `${settings.find(item => item.id == main.idModule)?.Link}?idhash=${content?.id}`
        return (<MenuItem onClick={handleUpdate}>
            <List
                sx={{ width: "400px", overflow: "hidden" }}
                component="div"
                aria-labelledby="nested-list-subheader"
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {main.Dadoc == 0 ? <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                    >
                        <Avatar>{user?.profile.Hoten.split(" ").slice(-1)[0].charAt(0)}</Avatar>
                    </StyledBadge> : <Avatar>{user?.profile.Hoten.split(" ").slice(-1)[0].charAt(0)}</Avatar>}
                    <p style={{ minWidth: "80px" }}>{settings.find(item => item.id == main.idModule)?.Thuoctinh}</p>
                    {
                        [3].includes(main.idModule) ?
                            <Link to={`${linkURL.split("https://tuyendung.tazagroup.vn")[1]}`} style={{ minWidth: "50px" }}>{`#${content?.id}`}</Link> :
                            <Link to={{ pathname: linkURL }} target="_blank" rel='noopener noreferrer' style={{ minWidth: "50px" }}>{`#${content?.id}`}</Link>
                    }
                    <CustomTooltip title={content?.text}>
                        <p>{content?.text}</p>
                    </CustomTooltip>
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
