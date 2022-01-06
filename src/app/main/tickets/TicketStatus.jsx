import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@material-ui/core';
import { styled } from '@mui/material/styles';
const useStyles = makeStyles({
    timeline: {
        wordBreak: "break-all",
        flexBasis: "250px",
        textAlign: "left",
        display: "flex",
        paddingTop: "4px",
        paddingLeft: "8px",
        wordSpacing: "1px"
    },
    item: {
        minHeight: "30px"
    },
    custom: {
        padding: "0px 16px",
    }
})

const CustomTitle = ({ item }) => {
    const users = useSelector(state => state.fuse.tickets.users)
    const name = users.find(flag => flag.id == item.Daduyet)?.name
    const createdAt = new Date(`${item.Ngaytao}`).toLocaleDateString("en-GB")
    const updatedAt = new Date(`${item.Ngayupdate}`).toLocaleDateString("en-GB")
    const status = item.status !== 0 ? (item.status === 1 ? "Đã duyệt" : "Từ chối") : "Chờ duyệt"
    return (
        <React.Fragment>
            <p>Trạng thái : {status}</p>
            {item.status === 2 && <p>Lý do : {item.Lydo}</p>}
            {item.status !== 0 && <p>Người duyệt : {name}</p>}
            <p>Ngày tạo : {createdAt}</p>
            {item.status !== 0 && <p>Ngày cập nhật : {updatedAt}</p>}
        </React.Fragment>
    )
}

export const CustomTooltip = styled(({ className, ...props }) => (
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

const TicketStatus = ({ item, isHidden }) => {
    const steps = JSON.parse(item['Pheduyet'])
    const classes = useStyles()
    const CustomTimeline = ({ item, title }) => {
        let classStatus = "disabled"
        if (item) {
            const { status } = item
            if (status === 0) { classStatus = "wait" }
            else if (status === 1) { classStatus = "success" }
            else { classStatus = "fail" }
        }
        return (
            <TimelineItem className={classes.item}>
                <TimelineSeparator>
                    <CustomTooltip title={item ? <CustomTitle item={item} /> : "Chờ xử lí"}>
                        <TimelineDot className={`timeline ${classStatus}`} />
                    </CustomTooltip>
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{title}</p>
                </TimelineContent>
            </TimelineItem>
        )
    }
    const CustomTimelineConnector = ({ item, title }) => {
        let classStatus = "disabled"
        if (item) {
            const { status } = item
            if (status === 0) { classStatus = "wait" }
            else if (status === 1) { classStatus = "success" }
            else { classStatus = "fail" }
        }
        return (
            <TimelineItem className={classes.item}>
                <TimelineSeparator>
                    <CustomTooltip title={item ? <CustomTitle item={item} /> : "Chờ xử lí"}>
                        <TimelineDot className={`timeline ${classStatus}`} />
                    </CustomTooltip>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{title}</p>
                </TimelineContent>
            </TimelineItem>
        )
    }
    return (<Fragment>
        {isHidden ? <div style={{ height: "130px" }}></div> :
            <div className="scroll__status" style={{ width: "100%", overflow: "auto" }}>
                <Box sx={{ flexGrow: 1, textAlign: "center", width: "1200px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <h3>Ban quản lí</h3>
                            <Timeline className={classes.custom}>
                                <CustomTimeline item={steps[0]} title="B1:Duyệt phiếu tuyển dụng" />
                            </Timeline>
                        </Grid>
                        <Grid item xs={3}>
                            <h3>Ban tuyển dụng</h3>
                            <Timeline className={classes.custom}>
                                <CustomTimelineConnector item={steps[1]} title="B2:Tiếp nhận tuyển dụng" />
                                <CustomTimelineConnector item={steps[3]} title="B4:Triển khai tuyển dụng" />
                                <CustomTimeline item={steps[6]} title="B7:Thực hiện tuyển dụng" />
                            </Timeline>
                        </Grid>
                        <Grid item xs={3}>
                            <h3>Ban giám đốc</h3>
                            <Timeline className={classes.custom}>
                                <CustomTimelineConnector item={steps[2]} title="B3:Phê duyệt phiếu" />
                                <CustomTimeline item={steps[4]} title="B5:Phê duyệt tuyển dụng" />
                            </Timeline>
                        </Grid>
                        <Grid item xs={3}>
                            <h3>Ban kế toán</h3>
                            <Timeline className={classes.custom}>
                                <CustomTimeline item={steps[5]} title="B6:Xác nhận thanh toán" />
                            </Timeline>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        }
    </Fragment>
    )
}

export default TicketStatus
