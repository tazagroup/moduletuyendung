import React from 'react'
import { MTableEditField } from '@material-table/core'
const CustomEdit = ({ item, step }) => {
    const { onChange, onRowDataChange, rowData, ...props } = item
    const onCustomChange = value => {
        const newValue = { ...rowData }
        // if (value === "1") {
        //     // Next step 
        //     const newStep = { id: step + 1, nguoiDuyet: "", status: 0, ngayTao: new Date().toISOString() }
        //     newValue[`${step}`] = newStep
        // }
        //Current user & step
        newValue[`${step - 1}`].nguoiDuyet = "Chí Kiệt"
        newValue[`${step - 1}`].status = value
        newValue[`${step - 1}`].ngayTao = new Date().toLocaleDateString("en-GB")
        onRowDataChange(newValue);
    };
    return <MTableEditField onChange={onCustomChange} {...props} />
}

export default CustomEdit
