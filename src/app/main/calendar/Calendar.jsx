import React from 'react'
import FusePageSimple from '@fuse/core/FusePageSimple';
import Main from "./Main"
const Calendar = () => {
    return (
        <FusePageSimple
            header={
                <div className="p-24">
                    <h4>Phiếu yêu cầu tuyển dụng</h4>
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

