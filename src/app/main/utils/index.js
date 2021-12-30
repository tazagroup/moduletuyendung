import React, { Fragment } from 'react'
import { Tooltip } from '@material-ui/core';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// export function getStatusRendering(rowData) {
//     if (rowData.Tinhtrang === "") return <></>
//     if (rowData.Tinhtrang === "Chưa thanh toán") {
//         return (<Tooltip title="Chưa thanh toán">
//             <div style={{ display: "flex", justifyContent: "center" }}>
//                 <CancelIcon style={{ fill: "red" }} />
//             </div>
//         </Tooltip>)
//     }
//     else {
//         return (
//             <Tooltip title="Đã thanh toán">
//                 <div style={{ display: "flex", justifyContent: "center" }}>
//                     <CheckCircleIcon style={{ fill: "green" }} />
//                 </div>
//             </Tooltip>
//         );
//     }
// }
// export function getTypeRendering(id) {
//     const typeArray = [
//         { id: 0, title: "Thanh toán tiền mặt" },
//         { id: 1, title: "Chuyển khoản" },
//     ]
//     const result = typeArray.find(item => item.id === id)
//     return (
//         <div>{result.title}</div>
//     )
// }
const user = JSON.parse(localStorage.getItem("profile"))
export const ConvertPermissionArray = (array, field) => {
    let mainData = []
    if ([2, 3, 4].some(item => user.profile.PQTD.includes(item))) {
        mainData = [...array]
    }
    else {
        mainData = array.filter(item => item[`${field}`] == user.profile.Vitri).map(({ id, ...item }, index) => ({
            ...item,
            id: index
        }))
    }
    return mainData
}

export const ConvertNoHiddenArray = (array) => {

}