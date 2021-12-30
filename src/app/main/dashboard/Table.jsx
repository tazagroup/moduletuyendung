import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setDataTicket } from 'app/store/fuse/ticketsSlice';
import { setDataCandidate } from 'app/store/fuse/candidateSlice';
//COMPONENTS
import "chartjs-plugin-datalabels";
import Report2 from './Report2/index'
import Report3 from './Report3/index'
//API
import candidatesAPI from 'api/candidatesAPI'
import ticketsAPI from 'api/ticketsAPI';

const Table = () => {
    const dispatch = useDispatch();
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const dataCandidate = useSelector(state => state.fuse.candidates.dataCandidate)
    const position = useSelector(state => state.fuse.tickets.position)
    const users = useSelector(state => state.fuse.tickets.users)
    /* STATES */
    const [labelsReport3, setLabelsReport3] = useState([])
    const [dataReport3, setDataReport3] = useState([])
    const [selectReport3, setSelectReport3] = useState(null)
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
        const response = await Promise.all(fetchData)
    }, [])
    return (
        <>
            <Report2 />
            <Report3 />
        </>
    )
}

export default Table
