import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography, FormControl } from '@mui/material'
import Flatpickr from "react-flatpickr";
import Main from './Main'
const convertData = (data) => {

}
const Report2 = () => {
    const flagData = useSelector(state => state.fuse.candidates.dashboardCandidate)
    const [mainData, setMainData] = useState([...flagData])
    const users = useSelector(state => state.fuse.tickets.users)
    const approveCandidate = mainData.filter(item => JSON.parse(item.XacnhanHS)?.Duyet == 1).length
    const approveIntern = mainData.filter(item => JSON.parse(item.XacnhanHS)?.XNPV == 1).length
    const passIntern = mainData.filter(item => item.Trangthai == 1).length
    const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(null)
    const labels = ["Hồ sơ đạt", "Đến phỏng vấn", "Đậu", "Nhận việc", "Nghỉ việc"]
    const total = mainData.length
    const data = [approveCandidate, approveIntern, passIntern, 0, 0]
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
                <Typography variant="h3" gutterBottom component="div">Báo cáo tuyển dụng</Typography>
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
