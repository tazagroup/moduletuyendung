import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography, FormControl } from '@mui/material'
import Flatpickr from "react-flatpickr";
import Main from './Main'

const Report2 = () => {
    const flagData = useSelector(state => state.fuse.candidates.dashboardCandidate)
    const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(null)
    const labels = ["IT", "SEO", "Kế toán", "Quản lí", "Giảng viên"]
    const data = [10, 3, 5, 8, 7]
    const handleChangeMin = (e) => {
        setMinDate(e)
    }
    const handleChangeMax = (e) => {
        setMaxDate(e)
    }
    useEffect(() => {
        if (minDate || maxDate) {
        }
    }, [minDate, maxDate])
    return (
        <Grid container spacing={2} style={{ justifyContent: "center" }}>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom component="div">Báo cáo tình trạng ứng viên</Typography>
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
                <Main labels={labels} data={data} />
            </Grid>
        </Grid>
    )
}

export default Report2
