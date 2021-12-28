import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setDataTicket } from 'app/store/fuse/ticketsSlice';
import { setDataCandidate } from 'app/store/fuse/candidateSlice';
import { Grid, Typography } from '@mui/material'
import ReactApexChart from "react-apexcharts";
//API
import candidatesAPI from 'api/candidatesAPI'
import ticketsAPI from 'api/ticketsAPI';
const Table = () => {
    const dispatch = useDispatch();
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const dataCandidate = useSelector(state => state.fuse.candidates.dataCandidate)
    const position = useSelector(state => state.fuse.tickets.position)
    const users = useSelector(state => state.fuse.tickets.users)
    useEffect(async () => {
        const fetchData = []
        if (true) {
            if (dataTicket.length == 0) {
                fetchData.push(ticketsAPI.getTicket())
            }
            if (dataCandidate.length == 0) {
                fetchData.push(candidatesAPI.getCandidate())
            }
        }
        Promise.all(fetchData).then(value => console.log(value))

    }, [])
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" component="div" gutterBottom>
                        Báo cáo nguồn
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    a
                </Grid>
                <Grid item xs={6}>
                    b
                </Grid>
            </Grid>
        </div>
    )
}

export default Table
