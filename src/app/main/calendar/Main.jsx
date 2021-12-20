import React from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import daygridPlugin from '@fullcalendar/daygrid'
// import { Inject, ScheduleComponent, Day, Week, Month, Agenda, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'


const CustomTemplate = ({ item }) => {
    return (
        <div>{item.Subject}</div>
    )
}
const Main = () => {
    return (
        <FullCalendar
            plugins={[daygridPlugin, timeGridPlugin]}
            buttonText={{
                today: 'Hôm nay',
                month: 'Tháng',
                week: 'Tuần',
                day: 'Ngày',
            }}
            allDayText="Cả ngày"
            locale={'vi'}
            headerToolbar={{
                start: 'prev,next', // will normally be on the left. if RTL, will be on the right
                center: 'title',
                end: 'dayGridMonth,timeGridWeek,timeGridDay today'
            }
            }
            initialDate={new Date()}
            initialView="timeGridDay"
        />
    )
}

export default Main


// BACKUP
// <ScheduleComponent
// currentView='Month'
// selectedDate={new Date()}
// eventSettings={{ dataSource: FakeData, template: (item) => { return <CustomTemplate item={item} /> } }}
// height='550px'
// >
// <ViewsDirective>
//     <ViewDirective option='Day' displayName="Ngày" isSelected={true} />
//     <ViewDirective option='Week' displayName="Tuần" />
//     <ViewDirective option='Month' displayName="Tháng" />
//     <ViewDirective option='Agenda' displayName="Tổng hợp" />
// </ViewsDirective>
// <Inject services={[Day, Week, Month, Agenda]} />
// </ScheduleComponent>