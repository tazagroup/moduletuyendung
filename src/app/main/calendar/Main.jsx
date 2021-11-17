import React from 'react'
import { Inject, ScheduleComponent, Day, Week, Month, Agenda, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'


const CustomTemplate = ({ item }) => {
    return (
        <div>{item.Subject}</div>
    )
}
const Main = () => {
    const FakeData = [
        {
            Id: 1,
            Subject: 'Phỏng vấn vòng 1',
            StartTime: new Date(2021, 10, 16, 6, 0),
            EndTime: new Date(2021, 10, 16, 6, 30),
            Location: "Taza"
        }
    ]
    return (
        <ScheduleComponent
            currentView='Month'
            selectedDate={new Date()}
            eventSettings={{ dataSource: FakeData, template: (item) => { return <CustomTemplate item={item} /> } }}
            height='550px'
        >
            <ViewsDirective>
                <ViewDirective option='Day' displayName="Ngày" isSelected={true} />
                <ViewDirective option='Week' displayName="Tuần" />
                <ViewDirective option='Month' displayName="Tháng" />
                <ViewDirective option='Agenda' displayName="Tổng hợp" />
            </ViewsDirective>
            <Inject services={[Day, Week, Month, Agenda]} />
        </ScheduleComponent>

    )
}

export default Main
