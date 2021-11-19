import React, { Fragment } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import InfoIcon from '@mui/icons-material/Info';
import { makeStyles } from '@material-ui/core';

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
})
const TicketStatus = () => {
    const classes = useStyles()
    const CustomTimeline = ({ item }) => {
        return (
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="secondary" />
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{item}</p>
                    <Tooltip title="Đã duyệt">
                        <InfoIcon />
                    </Tooltip>
                </TimelineContent>
            </TimelineItem>
        )
    }
    const CustomTimelineConnector = ({ item }) => {
        return (
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="secondary" />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{item}</p>
                    <Tooltip title="Đã duyệt">
                        <InfoIcon />
                    </Tooltip>
                </TimelineContent>
            </TimelineItem>
        )
    }
    return (
        <Fragment>
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <h1>Ban quản lí</h1>
                        <Timeline>
                            <CustomTimeline item="B1:Quản lí phê duyệt" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h1>Ban tuyển dụng</h1>
                        <Timeline>
                            <CustomTimelineConnector item="B2:Tiếp nhận tuyển dụng" />
                            <CustomTimelineConnector item="B4:Triển khai tuyển dụng" />
                            <CustomTimeline item="B7:Thực hiện tuyển dụng" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h1>Ban giám đốc</h1>
                        <Timeline>
                            <CustomTimelineConnector item="B3:Phê duyệt phiếu" />
                            <CustomTimeline item="B5:Phê duyệt tuyển dụng" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h1>Ban kế toán</h1>
                        <Timeline>
                            <CustomTimeline item="B6:Xác nhận thanh toán" />
                        </Timeline>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    )
}

export default TicketStatus
