import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, setDataTicket } from 'app/store/fuse/ticketsSlice';
import { fetchCandidates, setDataCandidate } from 'app/store/fuse/candidateSlice';
import FuseLoading from '@fuse/core/FuseLoading';
const index = () => {
    const dispatch = useDispatch()
    const isLoadingTickets = useSelector(state => state.fuse.tickets.isLoading)
    const isLoadingCandidates = useSelector(state => state.fuse.candidates.isLoading)
    useEffect(async () => {
        dispatch(fetchTickets()).then(res => {
            const data = res.payload;
            if (data) {
                const result = data.map(({ id: key, ...item }, index) => ({
                    id: index,
                    key,
                    ...item,
                }))
                dispatch(setDataTicket(result))
            }
        })
    }, [])
    useEffect(async () => {
        dispatch(fetchCandidates()).then(res => {
            const data = res.payload;
            if (data) {
                const result = data.map(({ id: key, ...item }, index) => ({
                    id: index,
                    key,
                    ...item,
                }))
                dispatch(setDataCandidate(result))
            }
        })
    }, [])
    if (isLoadingTickets || isLoadingCandidates) return <FuseLoading />
    return (
        <div>
            Đây là dashboard
        </div>
    )
}

export default index
