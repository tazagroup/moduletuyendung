import React from 'react'
import Table from './Table'
import FusePageSimple from '@fuse/core/FusePageSimple';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Tabs, Tab, Box } from '@material-ui/core';
import './index.css'
const Tickets = () => {
    const [value, setValue] = React.useState('one')
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
            contentToolbar={
                <div className="px-24">
                    <Box sx={{ width: '100%' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            textColor="secondary"
                            indicatorColor="secondary"
                            aria-label="secondary tabs example"
                        >
                            <Tab value="one" label="Phiếu tuyển dụng" />
                        </Tabs>
                    </Box>
                </div>
            }
            content={
                <div className="p-24">
                    <TabContext value={value}>
                        <TabPanel value="one">
                            <Table />
                        </TabPanel>
                    </TabContext>
                    <br />
                </div>
            }
        />
    )
}

export default Tickets
