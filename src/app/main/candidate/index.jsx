import React from 'react'
import Table from './Table'

import FusePageSimple from '@fuse/core/FusePageSimple';
import "./index.css"
const Candidates = () => {

    return (
        <FusePageSimple
            header={
                <div className="p-24">
                    <h4>Hồ sơ ứng viên</h4>
                </div>
            }
            content={
                <div className="p-24">
                    <Table />
                    <br />
                </div>
            }
        />
    )
}

export default Candidates
