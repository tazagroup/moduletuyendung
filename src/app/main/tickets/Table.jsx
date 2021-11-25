import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { openDialog } from 'app/store/fuse/dialogSlice';
import MaterialTable, { MTableAction, MTableEditField } from '@material-table/core';
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'
import { DatePicker } from "react-rainbow-components";
import CustomEdit from './CustomEdit';
import ModalCreateItem from "./ModalCreateItem"
import TicketStatus from './TicketStatus'
import EmptyStatus from './EmptyStatus'
import CreateCandidate from './../candidate/CreateCandidate'
import CustomStep from './CustomStep'
import { getStatusRendering } from './utils';
const convertProperty = (array) => {
    const arrayResult = {
        BQL: [],
        BTD: [],
        BGD: [],
        BKT: []
    }
    const stepBTD = [1, 3, 6]
    const stepBGD = [2, 4]
    array.reduce(function (result, item, index) {
        if (item.id === 0) {
            result['BQL'].push(item);
        }
        else if (stepBTD.includes(index)) {
            result['BTD'].push(item);
        }
        else if (stepBGD.includes(index)) {
            result['BGD'].push(item);
        }
        else {
            result['BKT'].push(item);
        }
        return result;
    }, arrayResult);
    return arrayResult
}

export default function Table() {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [rowData, setRowData] = useState({});
    const [initialData, setInitialData] = useState({})
    const [dataStatus, setDataStatus] = useState(null)
    const [isFiltering, setIsFiltering] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isCC, setIsCC] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const tableRef = useRef();
    //TEST FETCHING
    const [isFetching, setIsFetching] = useState(false)
    useEffect(async () => {
        const response = await axios.get('https://6195d82474c1bd00176c6ede.mockapi.io/Tickets')
        if (response) {
            const responseData = response.data
            const data = responseData.map(({ id: key, ...item }) => ({
                key,
                ...item,
            }))
            setData(data)
            setIsLoading(false)
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
        { title: "Vị trí tuyển dụng", field: "Vitri" },
        { title: "Nhân sự hiện có", field: "SLHientai", type: 'numeric' },
        { title: "Nhân sự cần tuyển", field: "SLCantuyen", type: "numeric" },
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
        { title: "Lí do tuyển dụng", field: "Lydo" },
        { title: "Mô tả tuyển dụng", field: "MotaTD", },
        {
            title: "Nguồn", field: "Nguon",
            emptyValue: () => <ClearIcon />,
            editComponent: (item) => {
                const steps = item.rowData['Pheduyet'].length
                return steps >= 3 ? <MTableEditField {...item} /> : <></>
            }
        },
        {
            title: "Thời gian mua",
            field: "TGMua",
            type: "date",
            dateSetting: { locale: "en-GB" },
            emptyValue: () => <ClearIcon />,
            editComponent: (item) => {
                const steps = item.rowData['Pheduyet'].length
                return steps >= 3 ?
                    <DatePicker
                        locale="en-GB"
                        value={item.value}
                        onChange={(date) => props.onChange(date)}
                        style={{ marginTop: "9px" }}
                    /> : <></>
            }
        },
        {
            title: "Chi phí",
            field: "Chiphi",
            type: "currency",
            currencySetting: { locale: 'vi', currencyCode: "VND", minimumFractionDigits: 0 },
            render: (rowData) => { return rowData.Chiphi == "" ? <ClearIcon /> : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rowData.Chiphi) },
            editComponent: (item) => {
                const steps = item.rowData['Pheduyet'].length
                return steps >= 3 ? <MTableEditField {...item} /> : <></>
            }
        },
        {
            title: "Hình thức", field: "Hinhthuc", lookup: { 0: "Thanh toán tiền mặt", 1: "Chuyển khoản" },
            render: (rowData) => {
                return rowData.Hinhthuc === "" ? <ClearIcon /> : rowData.Hinhthuc
            },
            editComponent: (item) => {
                const steps = item.rowData['Pheduyet'].length
                return steps >= 3 ? <MTableEditField {...item} /> : <></>
            }
        },
        {
            title: "Tình trạng", field: "Tinhtrang", lookup: { 0: "Chưa thanh toán", 1: "Đã thanh toán" },
            render: (rowData) => getStatusRendering(rowData),
            editComponent: (rowData) => <></>
        },
        {
            title: "Ban quản lí",
            field: "BQL",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BQL']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} setIsFetching={setIsFetching} />
                    )
                })
            },
            editComponent: (rowData) => <></>
        },
        {
            title: "Ban tuyển dụng",
            field: "BTD",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BTD']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} setIsFetching={setIsFetching} />
                    )
                })
            },
            editComponent: (rowData) => <></>
        },
        {
            title: "Ban giám đốc ",
            field: "BGĐ",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BGD']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} setIsFetching={setIsFetching} />
                    )
                })
            },
            editComponent: (rowData) => <></>
        },
        {
            title: "Ban kế toán ",
            field: "BKT",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BKT']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} setIsFetching={setIsFetching} />
                    )
                })
            },
            editComponent: (rowData) => <></>
        }
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
    const handleCreate = () => {
        setIsCC(true)
    }
    return isLoading ? <div>Loading...</div> : <Fragment>
        {dataStatus ? <TicketStatus item={dataStatus} /> : <EmptyStatus />}
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
                },
                body: {
                    emptyDataSourceMessage: "Không có dữ liệu hiển thị..."
                }
            }}
            icons={{
                ViewColumn: ViewColumnIcon,
            }}
            onRowClick={(event, rowData) => {
                setDataStatus(rowData)
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
            <MenuItem onClick={handleEdit}>Chỉnh sửa</MenuItem>
            <MenuItem onClick={handleCopy}>Sao chép</MenuItem>
            <MenuItem onClick={handleCreate}>Tạo hồ sơ</MenuItem>
        </Menu>
        {isCC && <CreateCandidate open={isCC} item={rowData} />}
    </Fragment>
}