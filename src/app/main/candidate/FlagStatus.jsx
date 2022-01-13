import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Grid } from '@mui/material'
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
const FlagStatus = () => {
    const classes = useStyles()
    const CustomTimeline = ({ title, classStatus = "disabled" }) => {
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
    const CustomTimelineConnector = ({ title, classStatus = "disabled" }) => {
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
    return (
        <div className="scroll__status" style={{ width: "100%", overflow: "auto" }}>
            <Box sx={{ flexGrow: 1, textAlign: "center", width: "1200px" }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <h3>Ban tuyển dụng</h3>
                        <Timeline>
                            <CustomTimelineConnector title="B1:Tạo hồ sơ" />
                            <CustomTimelineConnector title="B3:Xác nhận phỏng vấn" />
                            <CustomTimelineConnector title="B4:Đặt lịch phỏng vấn vòng 1" />
                            <CustomTimeline title="B8:Trả kết quả" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Ban chuyên môn</h3>
                        <Timeline>
                            <CustomTimelineConnector title="B2:Duyệt hồ sơ" />
                            <CustomTimelineConnector title="B5:Đặt lịch phỏng vấn vòng 2" />
                            <CustomTimeline title="B6:Đánh giá hồ sơ.Phê duyệt sau phỏng vấn" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Ban quản lí</h3>
                        <Timeline>
                            <CustomTimeline title="B7:Phê duyệt cuối cùng" />
                        </Timeline>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default FlagStatus
