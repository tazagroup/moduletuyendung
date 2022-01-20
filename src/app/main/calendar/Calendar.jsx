import React from 'react'
import FusePageSimple from '@fuse/core/FusePageSimple';
import Main from "./Main"
const Calendar = () => {
    return (
        <FusePageSimple
            header={
                <div className="p-24">
                </div>
            }
            content={
                <div className="p-24">
                    <Main />
                    <br />
                </div>
            }
        >
        </FusePageSimple>
    )
}

export default Calendar

