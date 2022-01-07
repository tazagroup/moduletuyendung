import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography } from '@mui/material'
import Main from './Main'
import Sub from './Sub'

const convertIdToName = (arr, id) => {
    return arr.find(opt => opt.id == id)?.Thuoctinh
}

const Report3 = () => {
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])
    const [subLabels, setSubLabels] = useState([])
    const [subData, setSubData] = useState([])
    const [select, setSelect] = useState(null)
    const source = useSelector(state => state.fuse.tickets.source)
    const position = useSelector(state => state.fuse.tickets.position)
    const mainDataTicket = useSelector(state => state.fuse.tickets.dashboardTicket)
    const mainDataCandidate = useSelector(state => state.fuse.candidates.dashboardCandidate)
    //DATA
    const renderData = mainDataCandidate.map((item, index) => {
        return {
            id: index,
            idSource: JSON.parse(item.Profile).Nguon,
            Vitri: convertIdToName(position, mainDataTicket.find(opt => opt.key == item.idTicket)?.Vitri),
        }
    })
    useEffect(() => {
        const sourceData = renderData.map(item => source.find(opt => opt.id == item.idSource)?.Thuoctinh)
        const counts = {};
        sourceData.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });
        setLabels(Object.keys(counts))
        setData(Object.values(counts))
    }, [])
    useEffect(() => {
        if (select) {
            const index = source.find(item => item.Thuoctinh == select).id
            const sourceToPosition = renderData.filter(item => item.idSource == index)
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
