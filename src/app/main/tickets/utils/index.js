import React, { Fragment } from 'react'
import { Tooltip } from '@material-ui/core';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
export function getStatusRendering(rowData) {
    if (rowData.gdpd === "0") {
        return (<Tooltip title="Chờ xử lí">
            <div style={{ display: "flex", justifyContent: "center" }}>
                <PendingActionsIcon style={{ fill: "yellow" }} />
            </div>
        </Tooltip>)
    }
    else {
        return rowData.gdpd == "1" ? (
            <Tooltip title="Đã duyệt">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <CheckCircleIcon style={{ fill: "green" }} />
                </div>
            </Tooltip>
        ) : (
            <Fragment>
                <Tooltip title="Lí do : đủ chỉ tiêu">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <CancelIcon style={{ fill: "red" }} />
                    </div>
                </Tooltip>
            </Fragment>
        );
    }

}
