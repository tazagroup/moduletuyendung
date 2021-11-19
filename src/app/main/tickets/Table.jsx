import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { openDialog } from 'app/store/fuse/dialogSlice';
import MaterialTable, { MTableAction, MTableEditField } from '@material-table/core';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import ModalCreateItem from "./ModalCreateItem"
import TicketStatus from './TicketStatus'
import { getStatusRendering } from './utils/index'
import { TextField, makeStyles } from '@material-ui/core';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'
import { DatePicker } from "react-rainbow-components";

const convertProperty = (array) => {
    console.log(array)
    return Object.assign({}, array)
}

export default function Table() {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [rowData, setRowData] = useState({});
    const [initialData, setInitialData] = useState({})
    const [isFiltering, setIsFiltering] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const tableRef = useRef();
    //TEST FETCHING
    const [isFetching, setIsFetching] = useState(false)
    useEffect(async () => {
        const response = await axios.get('https://6195d82474c1bd00176c6ede.mockapi.io/Tickets')
        if (response) {
            const responseData = response.data
            const data = responseData.map(({ id: key, Pheduyet, ...item }) => ({
                key,
                ...convertProperty(Pheduyet),
                ...item,
            }))
            setData(data)
        }
    }, [isFetching])
    const headers = [
        {
            title: "#",
            field: "key",
            // editable: 'never',
            align: "center",
            editComponent: props => {
                return (
                    <div>
                    </div>
                )
            },
            render: rowData => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        aria-label="Example"
                        onClick={(event) => { handleClick(event, rowData) }}
                        size="large">
                        <MoreVertIcon />
                    </IconButton >
                    <p>{rowData.key}</p>
                </div>
            )
        },
        {
            title: "Vị trí tuyển dụng",
            field: "Vitri"
        },
        {
            title: "Nhân sự hiện có",
            field: "SLHientai",
            type: 'numeric'
        },
        {
            title: "Nhân sự cần tuyển",
            field: "SLCantuyen",
            type: "numeric"
        },
        {
            title: "Mức lương dự kiến",
            field: "LuongDK",
            type: "currency",
            currencySetting: { locale: 'vi', currencyCode: "VND", minimumFractionDigits: 0 }
        },
        {
            title: "Thời gian thử việc",
            field: "TGThuviec",
            type: "date",
            dateSetting: { locale: "en-GB" },
            editComponent: (props) => (
                <DatePicker
                    locale="en-GB"
                    value={props.value}
                    onChange={(date) => props.onChange(date)}
                    style={{ marginTop: "9px" }}
                />
            )
        },
        {
            title: "Thời gian tiếp nhận",
            field: "TiepnhanNS",
            type: "date",
            dateSetting: { locale: "en-GB" },
            editComponent: (props) => (
                <DatePicker
                    locale="en-GB"
                    value={props.value}
                    onChange={(date) => props.onChange(date)}
                    style={{ marginTop: "9px" }}
                />
            )
        },
        {
            title: "Lí do tuyển dụng",
            field: "Lydo"
        },
        {
            title: "Mô tả tuyển dụng",
            field: "MotaTD"
        },
        {
            title: "Bước 1", field: "0.status",
            lookup: { 0: "Chờ xử lí", 1: "Đã duyệt", 2: "Từ chối" },
            editComponent: ({ onChange, onRowDataChange, rowData, ...props }) => {
                const onCustomChange = value => {
                    const newValue = { ...rowData }
                    if (value === "1") {
                        const step = { id: 2, nguoiDuyet: "Kiệt", status: 0, ngayTao: new Date().toISOString() }
                        newValue["1"] = step
                    }
                    newValue['0'].nguoiDuyet = "Chí Kiệt"
                    newValue['0'].status = value
                    newValue['0'].ngayTao = new Date().toLocaleDateString("en-GB")
                    onRowDataChange(newValue);
                };
                return <MTableEditField onChange={onCustomChange} {...props} />
            }
        },
        { title: "Quản lí duyệt", field: "0.nguoiDuyet" },
        {
            title: "Bước 2", field: "1.status", lookup: { 0: "Chờ xử lí", 1: "Đã duyệt", 2: "Từ chối" },
            editComponent: ({ onChange, onRowDataChange, rowData, ...props }) => {
                const onCustomChange = value => {
                    const newValue = { ...rowData }
                    if (value === "1") {
                        const step = { id: 3, nguoiDuyet: "Kiệt", status: 0, ngayTao: new Date().toISOString() }
                        newValue["2"] = step
                    }
                    newValue['1'].nguoiDuyet = "Chí Kiệt"
                    newValue['1'].status = value
                    newValue['1'].ngayTao = new Date().toLocaleDateString("en-GB")
                    onRowDataChange(newValue);
                };
                return <MTableEditField onChange={onCustomChange} {...props} />
            }
        },
        { title: "Tuyển dụng tiếp nhận", field: "1.nguoiDuyet" },
        {
            title: "Bước 3", field: "2.status", lookup: { 0: "Chờ xử lí", 1: "Đã duyệt", 2: "Từ chối" },
            editComponent: ({ onChange, onRowDataChange, rowData, ...props }) => {
                const onCustomChange = value => {
                    const newValue = { ...rowData }
                    if (value === "1") {
                        const step = { id: 4, nguoiDuyet: "Kiệt", status: 0, ngayTao: new Date().toISOString() }
                        newValue["3"] = step
                    }
                    newValue['2'].nguoiDuyet = "Chí Kiệt"
                    newValue['2'].status = value
                    newValue['2'].ngayTao = new Date().toLocaleDateString("en-GB")
                    onRowDataChange(newValue);
                };
                return <MTableEditField onChange={onCustomChange} {...props} />
            }
        },
        { title: "Giám đốc duyệt yctd", field: "2.nguoiDuyet" },
        {
            title: "Bước 4", field: "3.status", lookup: { 0: "Chờ xử lí", 1: "Đã duyệt", 2: "Từ chối" },
            editComponent: ({ onChange, onRowDataChange, rowData, ...props }) => {
                const onCustomChange = value => {
                    const newValue = { ...rowData }
                    if (value === "1") {
                        const step = { id: 5, nguoiDuyet: "Kiệt", status: 0, ngayTao: new Date().toISOString() }
                        newValue["4"] = step
                    }
                    newValue['3'].nguoiDuyet = "Chí Kiệt"
                    newValue['3'].status = value
                    newValue['3'].ngayTao = new Date().toLocaleDateString("en-GB")
                    onRowDataChange(newValue);
                };
                return <MTableEditField onChange={onCustomChange} {...props} />
            }
        },
        { title: "Triển khai tuyển dụng", field: "3.nguoiDuyet" },
        {
            title: "Bước 5", field: "4.status", lookup: { 0: "Chờ xử lí", 1: "Đã duyệt", 2: "Từ chối" },
            editComponent: ({ onChange, onRowDataChange, rowData, ...props }) => {
                const onCustomChange = value => {
                    const newValue = { ...rowData }
                    if (value === "1") {
                        const step = { id: 6, nguoiDuyet: "Kiệt", status: 0, ngayTao: new Date().toISOString() }
                        newValue["5"] = step
                    }
                    newValue['4'].nguoiDuyet = "Chí Kiệt"
                    newValue['4'].status = value
                    newValue['4'].ngayTao = new Date().toLocaleDateString("en-GB")
                    onRowDataChange(newValue);
                };
                return <MTableEditField onChange={onCustomChange} {...props} />
            }
        },
        { title: "Giám đốc duyệt td", field: "4.nguoiDuyet" },
        {
            title: "Bước 6", field: "5.status", lookup: { 0: "Chờ xử lí", 1: "Đã duyệt", 2: "Từ chối" },
        },
        { title: "Kế toán xác nhận ns", field: "5.nguoiDuyet" },
    ];

    const flagColumns = headers.map(item => ({ ...item, align: "center", cellStyle: { whiteSpace: 'nowrap' }, headerStyle: { whiteSpace: 'nowrap' } }))
    const [columns, setColumns] = useState(flagColumns)
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
        //SET MORE PROPERTIES WHICH WON'T BE COPIED
        setInitialData({ ...rowData, name: null })
        tableRef.current.dataManager.changeRowEditing();
        tableRef.current.setState({
            ...tableRef.current.dataManager.getRenderState(),
            showAddRow: !tableRef.current.state.showAddRow
        });
    }
    return (
        <Fragment>
            <TicketStatus />
            <MaterialTable
                tableRef={tableRef}
                title={<>
                    <Tooltip title="Tạo hồ sơ tuyển dụng">
                        <IconButton
                            onClick={() => dispatch(openDialog({
                                children: <ModalCreateItem setIsFetching={setIsFetching} />,
                            }))}
                            variant="contained"
                            color="secondary"
                            size="large">
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
                components={{
                    Action: props => {
                        if (props.action.tooltip === "Add") {
                            return <div></div>
                        }
                        return <MTableAction {...props} />
                    },
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
                ]}
                editable={{
                    isEditHidden: (rowData) => rowData,
                    onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                newData.key = data.length + 1
                                setData([...data, newData]);
                                resolve();
                            }, 1000);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                                const dataUpdate = [...data];
                                const index = oldData.tableData.id;
                                dataUpdate[index] = newData;
                                setData([...dataUpdate]);
                                newData.Pheduyet = []
                                //6 steps
                                for (let i = 0; i < 6; i++) {
                                    if (newData[`${i}`] && Object.keys(newData[`${i}`]).length !== 0) {
                                        newData[`${i}`].id = i
                                        newData[`${i}`].ngayTao = new Date().toLocaleDateString("en-GB")
                                        newData.Pheduyet.push(newData[`${i}`])
                                        delete newData[`${i}`]
                                    }
                                    else {
                                        delete newData[`${i}`]
                                    }
                                }
                                axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets/${index + 1}`, newData)
                            }, 1000);
                        }),
                }}
                localization={{
                    toolbar: {
                        showColumnsTitle: "Hiển thị cột",
                    },
                    header: {
                        actions: ""
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