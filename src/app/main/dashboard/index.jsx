import React from 'react'
import Table from './Table'
import FusePageSimple from '@fuse/core/FusePageSimple';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import './index.css'
export const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: 12,
        border: '1px solid #dadde9',
    },
}));
const index = () => {
    return (
        <FusePageSimple
            header={
                <div className="p-24">
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

export default index
