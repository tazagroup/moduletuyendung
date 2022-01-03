import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography } from '@mui/material'
import Main from './Main'
import Sub from './Sub'

const convertIdToName = (arr, id) => {
    return arr.find(opt => opt.id == id).Thuoctinh
}

const Report1 = () => {
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])
    const [select, setSelect] = useState(null)
    //DATA
    useEffect(() => {
    }, [])
    useEffect(() => {
    }, [select])
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom component="div">Báo cáo định biên</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Main data={data} labels={labels} handleClick={setSelect} />
            </Grid>
            <Grid item xs={12} md={6}>
                {/* <Sub /> */}
            </Grid>
            <Grid item xs={12}>

            </Grid>
        </Grid>
    )
}

export default Report1
