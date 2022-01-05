import React from 'react'
import MaterialTable, { MTableAction } from '@material-table/core';
const Table = () => {
    return (
        <MaterialTable
            components={{
                Action: props => {
                    if (props.action.tooltip === "Add") {
                        return <div></div>
                    }
                    return <MTableAction {...props} />
                },
            }}
            editable={{
                isEditHidden: (rowData) => rowData,
            }}
            localization={{
                header: { actions: "" },
                body: { emptyDataSourceMessage: "Không có dữ liệu hiển thị..." },
                pagination: {
                    nextTooltip: "Trang kế tiếp", firstTooltip: "Trang đầu",
                    previousTooltip: "Trang trước", lastTooltip: "Trang cuối",
                    labelRowsSelect: ""
                }
            }}
            title="Tổng quát"
            options={{
                showDetailPanelIcon: false,
                columnsButton: false,
                search: false,
                paging: true,
                filtering: false,
                toolbarButtonAlignment: "left",
            }}
        >
        </MaterialTable>
    )
}

export default Table
