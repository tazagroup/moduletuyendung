import React, { Fragment } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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
const EmptyStatus = () => {
    const classes = useStyles()
    const CustomTimeline = ({ title }) => {
        return (
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot />
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{title}</p>
                </TimelineContent>
            </TimelineItem>
        )
    }
    const CustomTimelineConnector = ({ title }) => {
        return (
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{title}</p>
                </TimelineContent>
            </TimelineItem>
        )
    }
    return (
        <Fragment>
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                        <h3>Ban quản lí</h3>
                        <Timeline>
                            <CustomTimeline title="B1:Duyệt phiếu tuyển dụng" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <h3>Ban tuyển dụng</h3>
                        <Timeline>
                            <CustomTimelineConnector title="B2:Tiếp nhận tuyển dụng" />
                            <CustomTimelineConnector title="B4:Triển khai tuyển dụng" />
                            <CustomTimeline title="B7:Thực hiện tuyển dụng" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <h3>Ban giám đốc</h3>
                        <Timeline>
                            <CustomTimelineConnector title="B3:Phê duyệt phiếu" />
                            <CustomTimeline title="B5:Phê duyệt tuyển dụng" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <h3>Ban kế toán</h3>
                        <Timeline>
                            <CustomTimeline title="B6:Xác nhận thanh toán" />
                        </Timeline>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    )
}

export default EmptyStatus
