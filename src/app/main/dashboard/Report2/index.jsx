import React, { useState, useEffect } from 'react'
import { Grid, Typography, FormControl } from '@mui/material'
import Flatpickr from "react-flatpickr";
import Main from './Main'
const Report2 = () => {
    const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(null)
    const labels = ["Hồ sơ đạt", "Đến phỏng vấn", "Đậu", "Nhận việc", "Nghỉ việc"]
    const data = [8, 10, 8, 7, 5]
    const handleChangeMin = (e) => {
        setMinDate(e)
    }
    const handleChangeMax = (e) => {
        setMaxDate(e)
    }
    useEffect(() => {

    }, [minDate, maxDate])
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom component="div">Báo cáo tuyển dụng</Typography>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={5}>
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
                <Grid item xs>
                    <p style={{ textAlign: "center", lineHeight: "4.5", height: "100%" }}>-</p>
                </Grid>
                <Grid item xs={5}>
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
            <Grid item xs>
                <Main labels={labels} data={data} />
            </Grid>
        </Grid>
    )
}

export default Report2
