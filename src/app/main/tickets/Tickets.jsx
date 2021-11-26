import React from 'react'
import Table from './Table'
import SubMenu from './SubMenu'
import FusePageSimple from '@fuse/core/FusePageSimple';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Tabs, Tab, Box } from '@material-ui/core';
import './index.css'
const Tickets = () => {
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
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
