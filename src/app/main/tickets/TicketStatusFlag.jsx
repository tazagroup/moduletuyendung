import React, { Fragment, useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
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

const TicketStatus = () => {
    const classes = useStyles()
    const CustomTimeline = ({ title }) => {
        let classStatus = "disabled"
        return (
            <TimelineItem className={classes.item}>
                <TimelineSeparator>
                    <TimelineDot className={`timeline ${classStatus}`} />
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{title}</p>
                </TimelineContent>
            </TimelineItem>
        )
    }
    const CustomTimelineConnector = ({ title }) => {
        let classStatus = "disabled"
        return (
            <TimelineItem className={classes.item}>
                <TimelineSeparator>
                    <TimelineDot className={`timeline ${classStatus}`} />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{title}</p>
                </TimelineContent>
            </TimelineItem>
        )
    }
    return (<Fragment>
        <div className="scroll__status" style={{ width: "100%", overflow: "auto" }}>
            <Box sx={{ flexGrow: 1, textAlign: "center", width: "1200px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <h3>Ban quản lí</h3>
                        <Timeline className={classes.custom}>
                            <CustomTimeline title="B1:Duyệt phiếu tuyển dụng" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h3>Ban tuyển dụng</h3>
                        <Timeline className={classes.custom}>
                            <CustomTimelineConnector title="B2:Tiếp nhận tuyển dụng" />
                            <CustomTimelineConnector title="B4:Triển khai tuyển dụng" />
                            <CustomTimeline title="B7:Thực hiện tuyển dụng" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h3>Ban giám đốc</h3>
                        <Timeline className={classes.custom}>
                            <CustomTimelineConnector title="B3:Phê duyệt phiếu" />
                            <CustomTimeline title="B5:Phê duyệt tuyển dụng" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h3>Ban kế toán</h3>
                        <Timeline className={classes.custom}>
                            <CustomTimeline title="B6:Xác nhận thanh toán" />
                        </Timeline>
                    </Grid>
                </Grid>
            </Box>
        </div>
    </Fragment>
    )
}

export default TicketStatus
