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
import Select from '@mui/material/Select';
import axios from 'axios'
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
            const data = responseData.map(({ id: key, ...item }) => ({
                key,
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
            dateSetting: { locale: "en-GB" }
        },
        {
            title: "Thời gian tiếp nhận",
            field: "TiepnhanNS",
            type: "date",
            dateSetting: { locale: "en-GB" }
        },
        {
            title: "Lí do tuyển dụng",
            field: "Lydo"
        },
        {
            title: "Mô tả tuyển dụng",
            field: "MotaTD"
        },
        // {
        //     title: "Trạng thái",
        //     field: "status"
        // },
        // {
        //     title: "Giám đốc phê duyệt",
        //     field: "gdpd",
        //     lookup: { 0: "Chờ xử lí", 1: "Đã duyệt", 2: "Từ chối" },
        //     render: (item) => getStatusRendering(item),
        //     editComponent: props => (
        //         <Select
        //             labelId="demo-simple-select-standard-label"
        //             id="demo-simple-select-standard"
        //             value={props.value}
        //             onChange={e => props.onChange(e.target.value)}
        //             label="Giám đốc phê duyệt"
        //         >
        //             <MenuItem value="">
        //                 <em>None</em>
        //             </MenuItem>
        //             <MenuItem value={0}>Chờ xử lí</MenuItem>
        //             <MenuItem value={1}>Đã duyệt</MenuItem>
        //             <MenuItem value={2}>Từ chối</MenuItem>
        //         </Select>
        //     )
        // }
    ];
    const flagColumns = headers.map(item => ({ ...item, align: "right", cellStyle: { whiteSpace: 'nowrap' }, headerStyle: { whiteSpace: 'nowrap' } }))
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
                    }
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
                                axios.put(`https://6195d82474c1bd00176c6ede.mockapi.io/Tickets/${index + 1}`, newData)
                                setData([...dataUpdate]);
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