import React from 'react'
import Table from './Table'
import FusePageSimple from '@fuse/core/FusePageSimple';
import './index.css'
const Tickets = () => {
    return (
        <FusePageSimple
            header={
                <div className="p-24">
                </div>
            }
            content={
                <div className="p-24 main-table" style={{ paddingTop: 6, paddingBottom: 0 }}>
                    <Table />
                    <br />
                </div>
            }
        />
    )
}

export default Tickets
