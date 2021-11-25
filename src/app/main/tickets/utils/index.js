import React, { Fragment } from 'react'
import { Tooltip } from '@material-ui/core';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
export function getStatusRendering(rowData) {
    if (rowData.Tinhtrang === "") return <></>
    if (rowData.Tinhtrang === 0) {
        return (<Tooltip title="Chưa thanh toán">
            <div style={{ display: "flex", justifyContent: "center" }}>
                <CancelIcon style={{ fill: "red" }} />
            </div>
        </Tooltip>)
    }
    else {
        return (
            <Tooltip title="Đã thanh toán">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <CheckCircleIcon style={{ fill: "green" }} />
                </div>
            </Tooltip>
        );
    }

}
