import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography, FormControl, IconButton } from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { AiOutlineFileExcel } from 'react-icons/ai'
import { styled } from '@mui/material/styles';
import Flatpickr from "react-flatpickr";
import Main from './Main'
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
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
const Report2 = () => {
    const flagData = useSelector(state => state.fuse.candidates.dashboardCandidate)
    const [mainData, setMainData] = useState([...flagData])
    const users = useSelector(state => state.fuse.tickets.users)
    const approveCandidate = mainData.filter(item => {
        const main = JSON.parse(item.XacnhanHS)?.Duyet
        return main.status && main.status == 1
    }).length
    const approveIntern = mainData.filter(item => {
        const main = JSON.parse(item.XacnhanHS)?.XNPV
        return main ? main.status == 1 : false
    }).length
    const passIntern = mainData.filter(item => item.Trangthai == 1).length
    const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(null)
    const labels = ["Hồ sơ đạt", "Đến phỏng vấn", "Đậu", "Nhận việc", "Nghỉ việc"]
    const total = mainData.length
    const data = [approveCandidate, approveIntern, passIntern, 0, 0]
    const dataSet = [{
        columns: labels.map(item => ({ title: item })),
        data: [data.map(item => ({ value: item }))]
    }]
    console.log(dataSet)
    const handleChangeMin = (e) => {
        setMinDate(e)
    }
    const handleChangeMax = (e) => {
        setMaxDate(e)
    }
    useEffect(() => {
        if (minDate || maxDate) {
            const flag = [...flagData]
            const minValue = minDate ? new Date(minDate).getTime() : null
            const maxValue = maxDate ? new Date(maxDate).getTime() : null
            const result = flag.filter(item => new Date(item.Ngaytao) < maxValue && new Date(item.Ngaytao) > minValue)
            setMainData([...result])
        }
    }, [minDate, maxDate])

    return (
        <Grid container spacing={2} style={{ justifyContent: "center" }}>
            <Grid item xs={12}>
                <div className="flex">
                    <Typography variant="h3" component="div">Báo cáo tuyển dụng</Typography>
                    <ExcelFile element={(
                        <CustomTooltip title='Xuất Excel'>
                            <IconButton>
                                <AiOutlineFileExcel style={{ color: "green" }} />
                            </IconButton>
                        </CustomTooltip>
                    )}>
                        <ExcelSheet name="Báo cáo tuyển dụng" dataSet={dataSet} />
                    </ExcelFile>
                </div>
            </Grid>
            <Grid item container xs={12} style={{ justifyContent: "center" }}>
                <Grid item xs={2}>
                    <p style={{ fontSize: "12.5px", color: "rgba(0, 0, 0, 0.6)" }}>Từ ngày</p>
                    <FormControl fullWidth>
                        <Flatpickr
                            value={minDate}
                            options={{
                                allowInvalidPreload: true,
                                dateFormat: "d-m-Y",
                                static: true,
                            }}
                            onChange={(dateSelect) => handleChangeMin(dateSelect)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <p style={{ textAlign: "center", lineHeight: "4.5", height: "100%" }}>-</p>
                </Grid>
                <Grid item xs={2}>
                    <p style={{ fontSize: "12.5px", color: "rgba(0, 0, 0, 0.6)" }}>Đến ngày</p>
                    <FormControl fullWidth>
                        <Flatpickr
                            value={maxDate}
                            options={{
                                allowInvalidPreload: true,
                                dateFormat: "d-m-Y",
                                static: true,
                            }}
                            onChange={(dateSelect) => handleChangeMax(dateSelect)}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={12} md={8}>
                <Main labels={labels} data={data} total={total} />
            </Grid>
        </Grid>
    )
}

export default Report2
