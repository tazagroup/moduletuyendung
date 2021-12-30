import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
import Main from './Main'
import Sub from './Sub'
const Report3 = () => {
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])
    const [subLabels, setSubLabels] = useState([])
    const [subData, setSubData] = useState([])
    const [select, setSelect] = useState(null)

    //FAKE DATA
    const sourceArray = [{ id: 1, title: "Facebook" }, { id: 2, title: "TopCV" }, { id: 3, title: "ITViec" }, { id: 4, title: "Others" }]
    const fakeData = [
        { id: 1, idSource: 1, Vitri: "Sale" },
        { id: 2, idSource: 2, Vitri: "Marketing" },
        { id: 3, idSource: 1, Vitri: "Sale" },
        { id: 4, idSource: 4, Vitri: "IT" },
        { id: 5, idSource: 3, Vitri: "Lead" },
        { id: 6, idSource: 2, Vitri: "Manager" },
        { id: 7, idSource: 3, Vitri: "Sale" },
        { id: 8, idSource: 2, Vitri: "IT" },
        { id: 9, idSource: 2, Vitri: "Sale" },
    ]
    useEffect(() => {
        const sourceData = fakeData.map(item => sourceArray.find(opt => opt.id == item.idSource).title)
        const counts = {};
        sourceData.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });
        setLabels(Object.keys(counts))
        setData(Object.values(counts))
    }, [])
    useEffect(() => {
        if (select) {
            const index = sourceArray.find(item => item.title == select).id
            const sourceToPosition = fakeData.filter(item => item.idSource == index)
            const counts = {};
            sourceToPosition.map(item => item.Vitri).forEach(x => counts[x] = (counts[x] || 0) + 1)
            setSubLabels(Object.keys(counts))
            setSubData(Object.values(counts))
        }
    }, [select])
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom component="div">Báo cáo nguồn</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Main data={data} labels={labels} handleClick={setSelect} />
            </Grid>
            <Grid item xs={12} md={6}>
                {select && <Sub data={subData} labels={subLabels} />}
            </Grid>
        </Grid>
    )
}

export default Report3
