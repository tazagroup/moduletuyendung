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
import { Button } from '@mui/material';
export default function Table() {
    const dispatch = useDispatch()
    const [rowData, setRowData] = useState({});
    const [initialData, setInitialData] = useState({})
    const [isFiltering, setIsFiltering] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const tableRef = useRef();
    useEffect(() => {
        console.log(tableRef)
        setTimeout(() => {
            const hiddenButton = document.getElementsByClassName("MuiButtonBase-root-195 MuiIconButton-root-321 MuiIconButton-colorInherit-324")[2]
            hiddenButton.style.display = "none"
        }, 1000)
    }, [])
    const headers = [
        {
            title: "Vị trí tuyển dụng",
            field: "position"
        },
        {
            title: "Nhân sự hiện có",
            field: "employee",
            type: 'numeric'
        },
        {
            title: "Nhân sự cần tuyển",
            field: "recruit",
            type: "numeric"
        },
        {
            title: "Mức lương dự kiến",
            field: "salary",
            type: "currency",
            currencySetting: { locale: 'vi', currencyCode: "VND", minimumFractionDigits: 0 }
        },
        {
            title: "Thời gian thử việc",
            field: "probationary",
            type: "date",
            dateSetting: { locale: "en-GB" }
        },
        {
            title: "Thời gian tiếp nhận",
            field: "reception",
            type: "date",
            dateSetting: { locale: "en-GB" }
        },
        {
            title: "Lí do tuyển dụng",
            field: "reason"
        },
        {
            title: "Mô tả công việc",
            field: "description"
        },
        {
            title: "Trạng thái",
            field: "status"
        },
        {
            title: "Giám đốc phê duyệt",
            field: "gdpd",
            lookup: { 0: "Chờ xử lí", 1: "Đã duyệt", 2: "Từ chối" },
            render: (item) => getStatusRendering(item)
        }
    ];
    const flagColumns = headers.map(item => ({ ...item, align: "right", cellStyle: { whiteSpace: 'nowrap' }, headerStyle: { whiteSpace: 'nowrap' } }))
    const [columns, setColumns] = useState(flagColumns)
    const [data, setData] = useState([
        { position: 1, employee: 10, recruit: 5, salary: 5000000, probationary: "2020-06-13T12:00:00", reception: "2020-06-13T12:00:00", reason: "1", description: "...", status: "OK", gdpd: "1" },
        { position: 1, employee: 10, recruit: 5, salary: 5000000, probationary: "2020-06-13T12:00:00", reception: "2020-06-13T12:00:00", reason: "1", description: "...", status: "OK", gdpd: "1" },
    ]);
    const open = Boolean(anchorEl);
    const handleClick = (event, row) => {
        setRowData(row);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        setAnchorEl(null);
        setInitialData({ ...rowData, name: null })
        tableRef.current.dataManager.changeRowEditing(rowData, 'update');
        tableRef.current.setState({
            ...tableRef.current.dataManager.getRenderState(),
            showAddRow: false
        });
    }
    const handleCopy = () => {
        setAnchorEl(null);
        setInitialData({ ...rowData, name: null })
        tableRef.current.dataManager.changeRowEditing();
        tableRef.current.setState({
            ...tableRef.current.dataManager.getRenderState(),
            showAddRow: !tableRef.current.state.showAddRow
        });
    }
    return (
        <Fragment>
            <MaterialTable
                tableRef={tableRef}
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
                initialFormData={initialData}
                options={{
                    showDetailPanelIcon: false,
                    columnsButton: true,
                    search: false,
                    paging: true,
                    filtering: isFiltering,
                }}
                columns={columns}
                data={data}
                actions={[
                    {
                        icon: 'search',
                        tooltip: 'Lọc',
                        isFreeAction: true,
                        onClick: (event) => setIsFiltering(state => !state)
                    },
                    {
                        icon: MoreVertIcon,
                        tooltip: "Menu",
                        isFreeAction: false,
                        onClick: (event, row) => {
                            handleClick(event, row);
                        }
                    }
                ]}
                editable={{
                    isEditHidden: (rowData) => rowData,
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
                icons={{
                    ViewColumn: ViewColumnIcon,
                }}
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
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleCopy}>Copy</MenuItem>
            </Menu>
        </Fragment>
    );
}
