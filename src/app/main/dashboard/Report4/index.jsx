import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography, FormControl } from '@mui/material'
import Flatpickr from "react-flatpickr";
import Main from './Main'
import MaterialTable, { MTableAction } from '@material-table/core';
import guidesAPI from 'api/guideAPI'
const Report2 = () => {
    const dashboardData = useSelector(state => state.fuse.candidates.dashboardCandidate)
    const userData = useSelector(state => state.fuse.tickets.users)
    const positionData = useSelector(state => state.fuse.tickets.position)
    const [minDate, setMinDate] = useState(null)
    const [maxDate, setMaxDate] = useState(null)
    const [arrayStatus, setArrayStatus] = useState(null)
    const data = userData.map((item, index) => ({
        ...item,
        id: index,
        key: item.id,
    }))
    // const labels = ["IT", "SEO", "Kế toán", "Quản lí", "Giảng viên"]
    // const data = [10, 3, 5, 8, 7]
    const handleChangeMin = (e) => {
        setMinDate(e)
    }
    const handleChangeMax = (e) => {
        setMaxDate(e)
    }
    const convertIdToPos = (id) => {
        return positionData.find(opt => opt.id == id)?.Thuoctinh || "Nhân viên"
    }
    const columns = [
        {
            title: "#", field: "key", width: 50, align: "center",
            render: rowData => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <p>{rowData.id + 1}</p>
                </div>
            ),
            filterComponent: props => { return <></> },
        },
        {
            title: "Họ và tên", field: "name", cellStyle: { whiteSpace: 'nowrap' }, align: "center",
        },
        {
            title: "Vị trí", field: "name", cellStyle: { whiteSpace: 'nowrap' }, align: "center",
            render: rowData => convertIdToPos(rowData.position)
        },
        {
            title: "Tình trạng", field: "name", cellStyle: { whiteSpace: 'nowrap' }, align: "center",
            render: rowData => {
                return arrayStatus ? arrayStatus.find(opt => opt.id == rowData.Profile?.TTLV)?.Thuoctinh : <></>
            }
        },
    ]
    useEffect(async () => {
        const response = await guidesAPI.getStatus()
        setArrayStatus(JSON.parse(response.data.attributes.Dulieu))
    }, [])
    useEffect(() => {
        if (minDate || maxDate) {
        }
    }, [minDate, maxDate])
    return (
        <>
            <Grid container spacing={2} style={{ justifyContent: "center" }}>
                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom component="div">Báo cáo tình trạng ứng viên</Typography>
                </Grid>
                <Grid item container xs={12} style={{ justifyContent: "center" }}>
                    <Grid item xs={2}>
                        <p style={{ fontSize: "12.5px", color: "rgba(0, 0, 0, 0.6)" }}>Từ ngày</p>
                        <FormControl fullWidth>
                            <Flatpickr
                                value={minDate}
                                options={{
                                    allowInvalidPreload: true,
                                    dateFormat: "d-m-Y",
                                    static: true,
                                }}
                                onChange={(dateSelect) => handleChangeMin(dateSelect)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <p style={{ textAlign: "center", lineHeight: "4.5", height: "100%" }}>-</p>
                    </Grid>
                    <Grid item xs={2}>
                        <p style={{ fontSize: "12.5px", color: "rgba(0, 0, 0, 0.6)" }}>Đến ngày</p>
                        <FormControl fullWidth>
                            <Flatpickr
                                value={maxDate}
                                options={{
                                    allowInvalidPreload: true,
                                    dateFormat: "d-m-Y",
                                    static: true,
                                }}
                                onChange={(dateSelect) => handleChangeMax(dateSelect)}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            {/* TABLE  */}
            <MaterialTable
                data={data}
                columns={columns}
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
                    toolbar: { showColumnsTitle: "Hiển thị cột", addRemoveColumns: "" },
                    header: { actions: "" },
                    body: { emptyDataSourceMessage: "Không có dữ liệu hiển thị..." },
                    pagination: {
                        nextTooltip: "Trang kế tiếp", firstTooltip: "Trang đầu",
                        previousTooltip: "Trang trước", lastTooltip: "Trang cuối",
                        labelRowsSelect: "hồ sơ"
                    }
                }}
                options={{
                    maxBodyHeight: 500,
                    headerStyle: { position: "sticky", top: 0 },
                    emptyRowsWhenPaging: true,
                    showDetailPanelIcon: false,
                    search: false,
                    paging: true,
                    toolbarButtonAlignment: "left",
                    pageSize: 10,       // make initial page size
                    pageSizeOptions: [10, 25, 50],
                    // rowStyle: rowData => {
                    //     let selected = flagCandidate && flagCandidate.tableData?.id === rowData.tableData.id;
                    //     return {
                    //         backgroundColor: selected ? "#3b5998" : "#FFF",
                    //         color: selected ? "#fff" : "#000",
                    //     };
                    // },
                }}
                title="Ứng viên"

            >
            </MaterialTable>
        </>
    )
}

export default Report2
