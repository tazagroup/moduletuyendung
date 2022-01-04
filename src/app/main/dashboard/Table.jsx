import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { setDataTicket, setSource } from 'app/store/fuse/ticketsSlice';
import { setDataCandidate } from 'app/store/fuse/candidateSlice';
import FuseLoading from '@fuse/core/FuseLoading';
//COMPONENTS
import "chartjs-plugin-datalabels";
import Report1 from './Report1/index'
import Report2 from './Report2/index'
import Report3 from './Report3/index'
import Report4 from './Report4/index'
//API
import candidatesAPI from 'api/candidatesAPI'
import ticketsAPI from 'api/ticketsAPI';



const Table = () => {
    const dispatch = useDispatch();
    const dataTicket = useSelector(state => state.fuse.tickets.dashboardTicket)
    const dataCandidate = useSelector(state => state.fuse.candidates.dashboardCandidate)
    const [isLoading, setIsLoading] = useState(true)
    const dispatchCandidate = (opt, idTicket) => {
        const mainCandidate = opt.data.map(item => item.attributes)
        const mainData = mainCandidate.filter(item2 => idTicket.includes(item2.idTicket))
        dispatch(setDataCandidate({ main: mainData, dashboard: mainCandidate }))
    }
    useEffect(async () => {
        const fetchData = []
        if (true) {
            if (dataTicket.length == 0) {
                fetchData.push(ticketsAPI.getTicket())
                fetchData.push(ticketsAPI.getPosition())
                fetchData.push(ticketsAPI.getUser())
                fetchData.push(ticketsAPI.getSource())
            }
            if (dataCandidate.length == 0) {
                fetchData.push(candidatesAPI.getCandidate())
            }
        }
        const response = await Promise.all(fetchData)
        let idTicket = []
        if (response.length == 1) { // ONLY FETCH CANDIDATES
            idTicket = dataTicket.map(item => item.key)
            dispatchCandidate(response[0], idTicket)
        }
        else if (response.length != 0) {
            const { data: { attributes: { Dulieu } } } = response[1]
            const { data } = response[2]
            const dataUser = data.map(({ attributes }) => ({ id: attributes.id, name: attributes.name, position: JSON.parse(attributes.Profile)?.Vitri, PQTD: JSON.parse(attributes.Profile)?.PQTD }))
            //get the approved tickets
            idTicket = response[0].data.map(item => item.attributes).filter(item2 => item2.Trangthai == 2).map(opt => opt.id)
            batch(() => {
                dispatch(setDataTicket({ data: response[0].data, position: Dulieu, users: dataUser }))
                dispatch(setSource(response[3].data))
                response[4] && dispatchCandidate(response[4], idTicket)
            })
        }
        setIsLoading(false)
    }, [])
    if (isLoading) return <FuseLoading />
    return (
        <>
            <Report1 />
            <Report2 />
            <Report3 />
            <Report4 />
        </>
    )
}

export default Table
