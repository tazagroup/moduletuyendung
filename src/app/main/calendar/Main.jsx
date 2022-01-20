import React, { useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector } from "react-redux"
import { setDataCandidate } from "app/store/fuse/candidateSlice"
import { setUsers } from 'app/store/fuse/ticketsSlice'
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
import ticketsAPI from "api/ticketsAPI"
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
            const [responseCandidate, responseUser] = await Promise.all([candidatesAPI.getCandidate(), ticketsAPI.getUser()])
            const dataUser = responseUser.data.map(({ attributes }) => ({ id: attributes.id, name: attributes.name, position: JSON.parse(attributes.Profile)?.Vitri, Profile: JSON.parse(attributes.Profile), PQTD: JSON.parse(attributes.Profile)?.PQTD }))
            const result = responseCandidate.data.map(item => item.attributes)
            dispatch(setDataCandidate({ main: result, dashboard: result }))
            dispatch(setUsers(dataUser))
        }
        setIsLoading(false)
    }, [])
    const data = [].concat.apply([], calendar.map(item => JSON.parse(item?.LichPV).VongPV)).filter(item => item);
    const result = data.filter(item => item != undefined).map(({ ThoigianPV, Title }) => {
        return {
            title: Title,
            date: ThoigianPV
        }
    })
    const handleClick = (e) => {
        const item = data.find(item => item.Title == e.event._def.title)
        setCalendarData(item)
        setOpenModal(true)
    }
    return isLoading ? <FuseLoading /> :
        (<>
            <FullCalendar
                plugins={[daygridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                allDayText="Cả ngày"
                dayMaxEvents={4}
                noEventsContent="Không có lịch phỏng vấn"
                buttonText={{
                    today: 'Hôm nay',
                    month: 'Tháng',
                    day: 'Ngày',
                    list: "Lịch tuần"
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
                    end: 'dayGridMonth listWeek'
                }
                }
                initialDate={new Date()}
                initialView="dayGridMonth"

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
