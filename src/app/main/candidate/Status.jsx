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
const Status = (props) => {
    const data = useSelector(state => state.fuse.candidates.flagCandidate)
    const XacnhanHS = JSON.parse(data.XacnhanHS)
    const LichPV = JSON.parse(data.LichPV).VongPV
    const DanhgiaHS = JSON.parse(data.DanhgiaHS)
    const lastStage = Array.isArray(LichPV) ? LichPV[LichPV.length - 1] : null
    const DuyetHS = JSON.parse(data.DuyetHS)
    const steps = [
        "Nhận kết quả.Gửi thư mời làm việc / thư cảm ơn quản lí cấp cao",
        "Gửi mail duyệt thư mời làm việc",
        "Gửi thư mời ứng viên",
        "Xác nhận ngày làm việc chính thức, báo bộ phận yêu cầu tuyển dụng"
    ]
    const currentStep = Object.keys(DuyetHS).includes("DuyetTD") ? steps[DuyetHS.DuyetTD.step] : null
    const classes = useStyles()
    const CustomTimeline = ({ item, title, classStatus = "disabled", currentStep }) => {
        let status = item ? (item == 1 ? "success" : "pending") : classStatus
        return (
            <TimelineItem className={classes.item}>
                <TimelineSeparator>
                    {currentStep ? (
                        <CustomTooltip title={currentStep}>
                            <TimelineDot className={`timeline ${status}`} />
                        </CustomTooltip>
                    ) : (
                        <TimelineDot className={`timeline ${status}`} />
                    )}
                </TimelineSeparator>
                <TimelineContent className={classes.timeline}>
                    <p style={{ marginTop: "3px" }}>{title}</p>
                </TimelineContent>
            </TimelineItem>
        )
    }
    const CustomTimelineConnector = ({ item, title, classStatus = "disabled" }) => {
        let status = item ? (item == 1 ? "success" : "pending") : classStatus
        return (
            <TimelineItem className={classes.item}>
                <TimelineSeparator>
                    <TimelineDot className={`timeline ${status}`} />
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
                            <CustomTimelineConnector title="B1:Tạo hồ sơ" classStatus='success' />
                            <CustomTimelineConnector item={XacnhanHS.XNPV?.status} title="B3:Xác nhận phỏng vấn" />
                            <CustomTimelineConnector item={LichPV ? (LichPV[0].Trangthai) : null} title="B4:Phỏng vấn vòng 1" />
                            <CustomTimeline item={Object.keys(DuyetHS).includes("DuyetTD") ? DuyetHS.DuyetTD.Trangthai : null} title="B8:Trả kết quả" currentStep={currentStep} />
                        </Timeline>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Ban chuyên môn</h3>
                        <Timeline>
                            <CustomTimelineConnector item={XacnhanHS.Duyet?.status} title="B2:Duyệt hồ sơ" />
                            <CustomTimelineConnector item={LichPV ? (LichPV.length !== 1 ? lastStage.Trangthai : null) : null} title="B5:Phỏng vấn vòng 2" />
                            <CustomTimeline item={Object.keys(DanhgiaHS).length !== 0 ? 1 : null} title="B6:Đánh giá hồ sơ.Phê duyệt sau phỏng vấn" />
                        </Timeline>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Ban quản lí</h3>
                        <Timeline>
                            <CustomTimeline item={Object.keys(DuyetHS).includes("DuyetQL") ? DuyetHS.DuyetQL.Trangthai : null} title="B7:Phê duyệt cuối cùng" />
                        </Timeline>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default Status
