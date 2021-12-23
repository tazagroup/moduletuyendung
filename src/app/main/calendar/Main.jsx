import React, { useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { setDataCandidate } from "app/store/fuse/candidateSlice"
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list';
import daygridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
//COMPONENTS
import FuseLoading from '@fuse/core/FuseLoading';
//API
import candidatesAPI from "api/candidatesAPI"
const Main = () => {
    const dispatch = useDispatch()
    const calendar = useSelector(state => state.fuse.candidates.dataCandidate)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(async () => {
        if (calendar.length == 0) {
            const response = await candidatesAPI.getCandidate()
            dispatch(setDataCandidate(response))
        }
        setIsLoading(false)
    }, [])
    const data = [].concat.apply([], calendar.map(item => JSON.parse(item?.LichPV).VongPV));
    const result = data.filter(item => item != undefined).map(({ ThoigianPV, Title }) => {
        return {
            title: Title,
            date: ThoigianPV
        }
    })
    const handleClick = (e) => {
        console.log(e)
    }
    return isLoading ? <FuseLoading /> :
        (
            <FullCalendar
                plugins={[daygridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                allDayText="Cả ngày"
                buttonText={{
                    today: 'Hôm nay',
                    month: 'Tháng',
                    week: 'Tuần',
                    day: 'Ngày',
                    list: "Tóm tắt tuần",
                }}
                dateClick={handleClick}
                events={result}
                locale={'vi'}
                headerToolbar={{
                    start: 'prev,next today',
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay listWeek'
                }
                }
                initialDate={new Date()}
                initialView="timeGridDay"
            />
        )
}

export default Main
