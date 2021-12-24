import React, { useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { setDataCandidate } from "app/store/fuse/candidateSlice"
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list';
import daygridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
//MUI
import { Tooltip } from '@mui/material';
import { styled } from "@mui/material/styles"
//COMPONENTS
import FuseLoading from '@fuse/core/FuseLoading';
import ModalCalendarItem from './ModalCalendarItem';
//API
import candidatesAPI from "api/candidatesAPI"
import './index.css'
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: 1em;
  `);
const Main = () => {
    const dispatch = useDispatch()
    const calendar = useSelector(state => state.fuse.candidates.dataCandidate)
    const [openModal, setOpenModal] = useState(false)
    const [calendarData, setCalendarData] = useState(null)
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
        const item = data.find(item => item.Title == e.event.title)
        setCalendarData(item)
        setOpenModal(true)
    }
    return isLoading ? <FuseLoading /> :
        (<>
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
                eventClick={handleClick}
                events={result}
                eventContent={(event) => {
                    return (
                        <TextTooltip title={`${event.event.title}`}>
                            <div className='fc-event-main-frame'>
                                {event.timeText &&
                                    <div className='fc-event-time'>{event.timeText}</div>
                                }
                                <div className='fc-event-title-container'>
                                    <div className='fc-event-title fc-sticky'>
                                        {event.event.title || <Fragment>&nbsp;</Fragment>}
                                    </div>
                                </div>
                            </div>
                        </TextTooltip>
                    )
                }}
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
            {openModal &&
                <ModalCalendarItem
                    open={openModal}
                    item={calendarData}
                    handleClose={() => { setOpenModal(false) }}
                />
            }
        </>

        )
}

export default Main
