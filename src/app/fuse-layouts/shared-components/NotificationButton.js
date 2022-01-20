import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { hideNotice, setDataNotice, updateNotice } from "app/store/fuse/noticesSlice"
import { setDataSetting } from "app/store/fuse/guideSlice"
//MUI
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { IconButton, Menu, MenuItem, List, Badge, styled, Tabs, Tab } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
//API
import noticesAPI from 'api/noticesAPI'
import moment from 'moment'
import 'moment/locale/vi'
moment.locale("vi")
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
    const [value, setValue] = useState(0)
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
        const content = JSON.parse(main?.Noidung)
        var id = content
        var mainText = ""
        var mainStep = ""
        if (typeof (content) == 'object') {
            id = content.id
            mainText = content?.text
            mainStep = content?.step
        }
        const handleUpdate = async (e) => {
            const bodyData = {
                ...main,
                Dadoc: 1
            }
            const response = await noticesAPI.updateNotice(bodyData)
            dispatch(updateNotice(response.data))
        }
        const handleHide = () => {
            const bodyData = {
                "id": item.attributes.id,
                "published": 1
            }
            noticesAPI.updateNotice(bodyData)
            dispatch(hideNotice(item.attributes.id))
        }
        const linkURL = `${settings.find(item => item.id == main.idModule)?.Link}?idhash=${id}`
        return (<MenuItem onClick={handleUpdate}>
            <List
                sx={{ width: "400px", overflow: "hidden" }}
                component="div"
                aria-labelledby="nested-list-subheader"
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "center" }}>
                    {main.Dadoc == 0 ? <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                    >
                        <Avatar>{user?.profile.Hoten.split(" ").slice(-1)[0].charAt(0)}</Avatar>
                    </StyledBadge> : <Avatar>{user?.profile.Hoten.split(" ").slice(-1)[0].charAt(0)}</Avatar>}
                    <p style={{ minWidth: "95px" }}>{settings.find(item => item.id == main.idModule)?.Thuoctinh}</p>
                    {
                        [3].includes(main.idModule) ?
                            <Link to={`${linkURL.split("https://tuyendung.tazagroup.vn")[1]}`} style={{ minWidth: "50px" }}>{`#${id}`}</Link> :
                            <Link to={{ pathname: linkURL }} target="_blank" rel='noopener noreferrer' style={{ minWidth: "50px" }}>{`#${id}`}</Link>
                    }
                    {mainStep ? (
                        <CustomTooltip title={mainStep}>
                            <p>{mainText}</p>
                        </CustomTooltip>
                    ) : (
                        <p>{mainText}</p>
                    )}
                    <CustomTooltip title={new Date(main.Ngaytao).toLocaleString("en-GB")}>
                        <p style={{ maxWidth: 70, whiteSpace: "pre-wrap" }}>{moment(main.Ngaytao).fromNow()}</p>
                    </CustomTooltip>
                    <IconButton onClick={handleHide}>
                        <VisibilityIcon />
                    </IconButton>
                </div>
            </List>
        </MenuItem>)
    }
    const handleChange = (event, value) => {
        setValue(value)
    }
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <>{children}</>
                )}
            </div>
        );
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
                        minWidth: 432,
                        height: 350,
                        marginTop: "13px",
                    },
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Tabs value={value} onChange={handleChange} variant="fullWidth" >
                    <Tab label="Thông báo mới" value={0} />
                    <Tab label="Tất cả" value={1} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    {renderNotice && renderNotice.map((item, index) => (
                        <NoticeItem key={index} item={item} />
                    ))}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {dataNotice && dataNotice.map((item, index) => (
                        <NoticeItem key={index} item={item} />
                    ))}
                </TabPanel>
            </Menu>
        </>

    )
}

export default NotificationButton
