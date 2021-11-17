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
const TicketStatus = () => {
    const CustomTimeline = ({ item }) => {
        return (
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="secondary" />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent style={{ wordBreak: "break-all", flexBasis: "150px", textAlign: "left", display: "flex" }}>
                    <p style={{ marginTop: "3px", marginRight: "3px" }}>{item}</p>
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
                            <CustomTimeline item="Duyệt đợt 1" />
                            <CustomTimeline item="Duyệt đợt 2" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h1>Ban tuyển dụng</h1>
                        <Timeline>
                            <CustomTimeline item="Duyệt đợt 1" />
                            <CustomTimeline item="Duyệt đợt 2" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h1>Ban giám đốc</h1>
                        <Timeline>
                            <CustomTimeline item="Duyệt đợt 1" />
                            <CustomTimeline item="Duyệt đợt 2" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={3}>
                        <h1>Ban kế toán</h1>
                        <Timeline>
                            <CustomTimeline item="Duyệt đợt 1" />
                            <CustomTimeline item="Duyệt đợt 2" />
                        </Timeline>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    )
}

export default TicketStatus
