import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import daygridPlugin from '@fullcalendar/daygrid'
// import { Inject, ScheduleComponent, Day, Week, Month, Agenda, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'

const Main = () => {
    return (
        <FullCalendar
            plugins={[daygridPlugin, timeGridPlugin]}
            allDayText="Cả ngày"
            buttonText={{
                today: 'Hôm nay',
                month: 'Tháng',
                week: 'Tuần',
                day: 'Ngày',
            }}
            events={[]}
            locale={'vi'}
            headerToolbar={{
                start: 'prev,next',
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