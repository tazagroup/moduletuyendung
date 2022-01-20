import React from 'react'
import Table from './Table'
import FusePageSimple from '@fuse/core/FusePageSimple';
import DateField from '../CustomField/DateField'
import "./index.css"
const Candidates = () => {
    return (
        <FusePageSimple
            header={
                <div className="p-24">
                </div>
            }
            content={
                <div className="p-12">
                    <Table />
                    <br />
                </div>
            }
        />
    )
}

export default Candidates
