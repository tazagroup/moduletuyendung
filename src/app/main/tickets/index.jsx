import React from 'react'
import Table from './Table'
import FusePageSimple from '@fuse/core/FusePageSimple';
import './index.css'
const Tickets = () => {
    return (
        <FusePageSimple
            header={
                <div className="p-24">
                    <h4>Phiếu yêu cầu tuyển dụng</h4>
                </div>
            }
            // contentToolbar={
            //     <div className="px-24">
            //     </div>
            // }
            content={
                <div className="p-24">
                    <Table />
                    <br />
                </div>
            }
        />
    )
}

export default Tickets
