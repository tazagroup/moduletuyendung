import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { openDialog } from 'app/store/fuse/dialogSlice';
import MaterialTable, { MTableAction } from '@material-table/core';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import ModalCreateItem from "./ModalCreateItem"
import TicketStatus from './TicketStatus'

import { getStatusRendering } from './utils/index'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
const ticketStatus = [
    { id: 0, title: "Chờ xử lí" },
    { id: 1, title: "Đã duyệt" },
    { id: 2, title: "Từ chối" }
]

const Table = () => {
    useEffect(() => {
        const hiddenButton = document.getElementsByClassName("MuiButtonBase-root-195 MuiIconButton-root-343 MuiIconButton-colorInherit-346")[2]
        hiddenButton.style.display = "none"
        const status = {}
        ticketStatus.map(item => status[item.id] = item.title)
        setStatus(status)
    }, [])
    const dispatch = useDispatch()
    const [isFiltering, setIsFiltering] = useState(false)
    const [status, setStatus] = useState({})
    const [rowData, setRowData] = useState({})
    const tableRef = React.useRef();
    const headers = [
        { title: "#", field: "id", },
        { title: "Vị trí tuyển dụng", field: "position", },
        { title: "Nhân sự hiện có", field: "employee", type: "numeric" },
        { title: "Nhân sự cần tuyển", field: "recruit", type: "numeric" },
        { title: "Mức lương dự kiến", field: "salary", type: "currency", currencySetting: { locale: 'vi', currencyCode: "VND", minimumFractionDigits: 0 } },
        { title: "Thời gian thử việc", field: "probationary", type: "date", dateSetting: { locale: "en-GB" } },
        { title: "Thời gian tiếp nhận", field: "reception", type: "date", dateSetting: { locale: "en-GB" } },
        { title: "Lí do tuyển dụng", field: "reasons" },
        { title: "Mô tả công việc", field: "mtcv" },
        { title: "Trạng thái", field: "status" },
        { title: "Giám đốc phê duyệt", field: "gdpd", lookup: status, render: (rowData) => getStatusRendering(rowData) },
    ]
    const columns = headers.map(item => ({ ...item, align: "right", cellStyle: { whiteSpace: 'nowrap' }, headerStyle: { whiteSpace: 'nowrap' } }))
    const [data, setData] = useState([
        { id: '1', position: "Marketing", employee: "10", recruit: "5", salary: "5000000", probationary: "2020-06-13T12:00:00", reception: "2020-06-13T12:00:00", reasons: "Thiếu", mtcv: "...", status: "1", gdpd: "1" },
        { id: '2', position: "Telesale", employee: "10", recruit: "5", salary: "5000000", probationary: "2020-06-13T12:00:00", reception: "2020-06-13T12:00:00", reasons: "Thiếu", mtcv: "...", status: "1", gdpd: "2" },
        { id: '3', position: "IT", employee: "5", recruit: "2", salary: "5000000", probationary: "2020-06-13T12:00:00", reception: "2020-06-13T12:00:00", reasons: "Thiếu", mtcv: "...", status: "1", gdpd: "2" },
        { id: '4', position: "IT", employee: "5", recruit: "2", salary: "5000000", probationary: "2020-06-13T12:00:00", reception: "2020-06-13T12:00:00", reasons: "Thiếu", mtcv: "...", status: "1", gdpd: "0" },
    ])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [initialState, setInitialState] = React.useState({})
    const open = Boolean(anchorEl);
    const handleClick = (event, row) => {
        setRowData(row)
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        setAnchorEl(null);
        setInitialState({ ...rowData, name: null })
        tableRef.current.dataManager.changeRowEditing(rowData, 'update');
        tableRef.current.setState({
            ...tableRef.current.dataManager.getRenderState(),
            showAddRow: false
        });
    }
    const handleCopy = () => {
        setAnchorEl(null);
        setInitialState({ ...rowData, name: null })
        tableRef.current.dataManager.changeRowEditing();
        tableRef.current.setState({
            ...tableRef.current.dataManager.getRenderState(),
            showAddRow: !tableRef.current.state.showAddRow
        });
        console.log(tableRef.current.state)
    }
    return (
        <Fragment>
            <TicketStatus />
            <MaterialTable
                tableRef={tableRef}
                initialFormData={initialState}
                title={<>
                    <Tooltip title="Tạo hồ sơ tuyển dụng">
                        <IconButton onClick={() => dispatch(openDialog({
                            children: <ModalCreateItem />
                        }))}
                            variant="contained"
                            color="secondary">
                            <AddBoxIcon style={{ width: "22px", height: "22px", fill: "#61DBFB" }} />
                        </IconButton>
                    </Tooltip>
                </>}
                columns={columns}
                data={data}
                options={{
                    search: false,
                    paging: true,
                    filtering: isFiltering,
                    columnsButton: true
                }}
                icons={{ ViewColumn: ViewColumnIcon }}
                actions={[
                    {
                        icon: 'search',
                        tooltip: 'Lọc',
                        isFreeAction: true,
                        onClick: (event) => setIsFiltering(state => !state)
                    },
                    {
                        icon: MoreVertIcon,
                        tooltip: 'Menu',
                        isFreeAction: false,
                        onClick: (event, row) => {
                            handleClick(event, row)
                        }
                    }
                ]}
                editable={{
                    onRowAdd: (newData) =>
                        Promise.resolve(setData([...data, newData])),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const dataUpdate = [...data];
                                const index = oldData.tableData.id;
                                dataUpdate[index] = newData;
                                setData([...dataUpdate]);

                                resolve();
                            }, 1000);
                        }),
                }}
                localization={{
                    toolbar: {
                        showColumnsTitle: "Hiển thị cột",
                    },
                    header: {
                        actions: "#"
                    }
                }}
                onFilterChange={(e) => {
                    console.log(e)
                    console.log(tableRef.current.dataManager.filteredData.length)
                }}
            // onRowClick={(e, data) => {
            //     //Handle row click
            // }}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEdit}>Chỉnh sửa</MenuItem>
                <MenuItem onClick={handleCopy}>Sao chép</MenuItem>
                <MenuItem onClick={handleClose}>Tạo hồ sơ</MenuItem>
            </Menu>
        </Fragment >
    )
}

export default Table
