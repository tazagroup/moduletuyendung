import React, { Fragment, useRef, useState, useEffect } from 'react'
import MaterialTable, { MTableAction, MTableEditField } from '@material-table/core';
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from 'app/store/fuse/dialogSlice';
import { setDataTicket } from 'app/store/fuse/ticketsSlice';
//ICON
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
//MUI
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from "react-rainbow-components";
//COMPONENTS
import FuseLoading from '@fuse/core/FuseLoading';
import ModalEditItem from './ModalEditItem'
import ModalCreateItem from "./ModalCreateItem"
import ModalCopyItem from './ModalCopyItem'
import TicketStatus from './TicketStatus'
import EmptyStatus from './EmptyStatus'
import CreateCandidate from '../candidate/CreateCandidate'
import CustomStep from './CustomStep'
import CustomPosition from './CustomPosition'
import { CustomDateEdit, CustomSelectEdit, CustomSelectPriceEdit, CustomAutocompleteEdit } from '../CustomField/CustomEdit';
import { getStatusRendering } from '../utils';
//API
import ticketsAPI from "api/ticketsAPI"
const convertProperty = (item = []) => {
    const array = JSON.parse(item)
    const arrayResult = { BQL: [], BTD: [], BGD: [], BKT: [] }
    const stepBTD = [1, 3, 6]
    const stepBGD = [2, 4]
    array.reduce(function (result, item, index) {
        if (item.id === 0) { result['BQL'].push(item); }
        else if (stepBTD.includes(index)) { result['BTD'].push(item); }
        else if (stepBGD.includes(index)) { result['BGD'].push(item); }
        else { result['BKT'].push(item); }
        return result;
    }, arrayResult);
    return arrayResult
}
const style = {
    maxWidth: "150px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
}
const MenuButton = {
    fontSize: "13px"
}
export default function Table() {
    const dispatch = useDispatch()
    const data = useSelector(state => state.fuse.tickets.dataTicket)
    const position = useSelector(state => state.fuse.tickets.position)
    const users = useSelector(state => state.fuse.tickets.users)
    const [rowData, setRowData] = useState({})
    const [initialData, setInitialData] = useState({})
    const [dataStatus, setDataStatus] = useState(null)
    const [isFiltering, setIsFiltering] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [isCC, setIsCC] = useState(false)
    const [isCreateTicket, setIsCreaterTicket] = useState(false)
    const [isEditTicket, setIsEditTicket] = useState(false)
    const [isCopyTicket, setIsCopyTicket] = useState(false)
    const [isBlock, setIsBlock] = useState(false)
    const tableRef = useRef();
    const headers = [
        {
            title: "#", field: "key", align: "center", hiddenByColumnsButton: true,
            filterComponent: props => { return <></> },
            render: rowData => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        aria-label="Example"
                        onClick={(event) => { handleClick(event, rowData) }}
                        size="large">
                        <MoreVertIcon />
                    </IconButton >
                    <p>{rowData.id + 1}</p>
                </div>
            )
        },
        {
            title: "Vị trí tuyển dụng", field: "Vitri",
            render: rowData => (<CustomPosition data={rowData} />),
            filterComponent: props => {
                return <CustomAutocompleteEdit {...props} width={175} field="Thuoctinh" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { Vitri } = rowData;
                return term.map(item => item.id).includes(Vitri);
            }
        },
        { title: "Nhân sự hiện có", field: "SLHT", type: 'numeric' },
        { title: "Nhân sự cần tuyển", field: "SLCT", type: "numeric" },
        {
            title: "Mức lương dự kiến",
            field: "LuongDK",
            type: "currency",
            currencySetting: { locale: 'vi', currencyCode: "VND", minimumFractionDigits: 0 },
            filterComponent: props => {
                return <CustomSelectPriceEdit {...props} data={salary} width={150} field="LuongDK" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const minPrice = Math.min(...term.map(item => item.minPrice))
                const maxPrice = Math.max(...term.map(item => item.maxPrice))
                if (!maxPrice) {
                    return rowData.LuongDK >= minPrice
                }
                return rowData.LuongDK >= minPrice && rowData.LuongDK <= maxPrice
            }
        },
        {
            title: "Thời gian thử việc",
            field: "TGThuviec",
            type: "date",
            dateSetting: { locale: "en-GB" },
            filterComponent: (props) => <CustomDateEdit {...props} />,
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true
                const time = Date.parse(rowData.TGThuviec)
                const beforeDate = Date.parse(term[0])
                const afterDate = Date.parse(term[1])
                return time >= beforeDate && time <= afterDate
            }
        },
        {
            title: "Thời gian tiếp nhận",
            field: "TGTN",
            type: "date",
            dateSetting: { locale: "en-GB" },
            render: (rowData) => {
                let flag = true;
                let value = 0
                if (JSON.parse(rowData['Pheduyet'])[2]) {
                    value = JSON.parse(rowData['Pheduyet'])[1].ngayUpdate
                    flag = false;
                }
                return flag ? <ClearIcon /> : new Date(value).toLocaleDateString("en-GB")
            },
            filterComponent: (props) => <CustomDateEdit {...props} />,
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true
                const time = Date.parse(JSON.parse(rowData.TNNS).ngayDuyet)
                const beforeDate = Date.parse(term[0])
                const afterDate = Date.parse(term[1])
                return time >= beforeDate && time <= afterDate
            }
        },
        {
            title: "Lí do tuyển dụng",
            field: "Lydo",
            render: (rowData) => (
                <div style={style}>
                    {rowData.Lydo}
                </div>
            ),
            filterComponent: props => {
                const data = ["Thay thế", "Tuyển mới", "Dự phòng nhân lực", "Khác"]
                return <CustomSelectEdit {...props} data={data} width={165} field="Lydo" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { Lydo } = rowData;
                const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực"]
                return term.includes(Lydo) || !arrayReason.includes(Lydo);
            }
        },
        {
            title: "Mô tả tuyển dụng",
            field: "Mota",
            render: (rowData) => (
                // render as HTML 
                <div style={style} dangerouslySetInnerHTML={{ __html: rowData.Mota }}>
                </div>
            )
        },
        {
            title: "Yêu cầu tuyển dụng",
            field: "Yeucau",
            render: (rowData) => (
                // render as HTML 
                <div style={style} dangerouslySetInnerHTML={{ __html: rowData.Yeucau }}>
                </div>
            )
        },
        {
            title: "Nguồn", field: "Nguon",
            render: (rowData) => {
                let flag = true;
                let value = 0
                if (JSON.parse(rowData['Pheduyet'])[2]) {
                    value = JSON.parse(rowData['Pheduyet'])[1].Nguon || <ClearIcon />
                    flag = false;
                }
                return flag ? <ClearIcon /> : value
            },
            filterComponent: props => {
                const data = ["Facebook", "TopCV", "ITViec"]
                return <CustomSelectEdit {...props} data={data} width={120} field="Nguon" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                if (JSON.parse(rowData['Pheduyet'])[2]) {
                    const { Nguon } = JSON.parse(rowData['Pheduyet'])[1]
                    return term.includes(Nguon);
                }
                return false;
            }
        },
        // {
        //     title: "Thời gian mua",
        //     field: "TGMua",
        //     type: "date",
        //     dateSetting: { locale: "en-GB" },
        //     emptyValue: () => <ClearIcon />,
        //     editComponent: (item) => {
        //         const steps = item.rowData['Pheduyet'].length
        //         return steps >= 3 ?
        //             <div style={{ width: "150px" }}>
        //                 <DatePicker
        //                     locale="en-GB"
        //                     value={item.value}
        //                     onChange={(date) => props.onChange(date)}
        //                     style={{ marginTop: "9px" }}
        //                 />
        //             </div> : <></>
        //     },
        //     filterComponent: (props) => <CustomDateEdit {...props} />,
        //     customFilterAndSearch: (term, rowData) => {
        //         if (term.length === 0) return true
        //         const time = Date.parse(rowData.TGThuviec)
        //         const beforeDate = Date.parse(term[0])
        //         const afterDate = Date.parse(term[1])
        //         return time >= beforeDate && time <= afterDate
        //     }
        // },
        {
            title: "Chi phí",
            field: "Chiphi",
            type: "currency",
            currencySetting: { locale: 'vi', currencyCode: "VND", minimumFractionDigits: 0 },
            render: (rowData) => {
                let flag = true; let value = 0; let flag2 = true; let value2 = 0
                if (JSON.parse(rowData['Pheduyet'])[2]) {
                    value = JSON.parse(rowData['Pheduyet'])[1].Chiphi;
                    flag = false;
                }
                const realCurrency = JSON.parse(rowData['Pheduyet'])[5]
                if (realCurrency) {
                    if (realCurrency.hasOwnProperty('CPTT')) {
                        value2 = realCurrency.CPTT
                        flag2 = false
                    }
                }
                const render =
                    <div>
                        Dự kiến : {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)}
                        {!flag2 && <div>Thực tế : {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value2)}</div>}
                    </div>
                return flag ? <ClearIcon /> : render
            },
            editComponent: (item) => {
                const steps = item.rowData['Pheduyet'].length
                return steps >= 3 ? <MTableEditField {...item} /> : <></>
            },
            filterComponent: props => {
                return <CustomSelectPriceEdit {...props} data={salary} width={150} field="Chiphi" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const minPrice = Math.min(...term.map(item => item.minPrice))
                const maxPrice = Math.max(...term.map(item => item.maxPrice))
                if (!maxPrice) {
                    return rowData.Chiphi >= minPrice
                }
                return rowData.Chiphi >= minPrice && rowData.Chiphi <= maxPrice
            }
        },
        {
            title: "Hình thức", field: "Hinhthuc",
            render: (rowData) => {
                let flag = true; let value = 0
                if (JSON.parse(rowData['Pheduyet'])[2]) {
                    value = JSON.parse(rowData['Pheduyet'])[1].Hinhthuc || <ClearIcon />;
                    flag = false;
                }
                return flag ? <ClearIcon /> : value
            },
            filterComponent: props => {
                const data = ["Chuyển khoản", "Thanh toán tiền mặt"]
                return <CustomSelectEdit {...props} data={data} width={165} field="Hinhthuc" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { Hinhthuc } = JSON.parse(rowData['Pheduyet'])[1];
                return term.includes(Hinhthuc);
            }
        },
        // {
        //     title: "Trạng thái", field: "Trang thai",
        //     render: (rowData) => getStatusRendering(rowData),
        //     editComponent: (rowData) => <></>,
        //     filterComponent: props => {
        //         const data = ["Chưa thanh toán", "Đã thanh toán"]
        //         return <CustomSelectEdit {...props} data={data} width={150} field="Tinhtrang" />
        //     },
        //     customFilterAndSearch: (term, rowData) => {
        //         if (term.length === 0 || term.length === 2) return true;
        //         const { Tinhtrang } = rowData;
        //         return term.includes(Tinhtrang);
        //     }
        // },
        {
            title: "Ban quản lí",
            field: "BQL",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BQL']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} />
                    )
                })
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ban tuyển dụng",
            field: "BTD",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BTD']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} />
                    )
                })
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ban giám đốc ",
            field: "BGĐ",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BGD']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} />
                    )
                })
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ban kế toán ",
            field: "BKT",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BKT']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} />
                    )
                })
            },
            filterComponent: (rowData) => <></>
        }
    ];
    const isHidden = localStorage.getItem("hidden")
    let isResult = []
    if (isHidden) {
        isResult = isHidden.split(",")
    }
    const flagColumns = headers.map(item => ({ ...item, align: "center", cellStyle: { whiteSpace: 'nowrap' }, headerStyle: { whiteSpace: 'nowrap' }, hidden: !isResult.includes(item.field) }))
    const [columns, setColumns] = useState(flagColumns)
    const [hiddenColumns, setHiddenColumns] = useState(headers.map(item => item.field))
    useEffect(async () => {
        const responseData = await ticketsAPI.getTicket();
        const responsePosition = await ticketsAPI.getPosition();
        const responseUser = await ticketsAPI.getUser();
        const { data: { attributes: { Dulieu } } } = responsePosition
        const { data } = responseUser
        const dataUser = data.map(({ attributes }) => ({ id: attributes.id, name: attributes.name }))
        dispatch(setDataTicket({ data: responseData.data, position: Dulieu, users: dataUser }))
        setIsLoading(false)
    }, [])
    useEffect(() => {
        localStorage.setItem("hidden", hiddenColumns);
    }, [hiddenColumns])
    const handleClick = (event, row) => {
        setRowData(row);
        setAnchorEl(event.currentTarget);
        if (row.Trangthai !== 1) {
            setIsBlock(true)
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        handleClose()
        setIsEditTicket(true)
    }
    const handleCopy = () => {
        setAnchorEl(null);
        //SET MORE PROPERTIES WHICH WON'T BE COPIED
        setIsCopyTicket(true)
    }
    const handleCreate = () => {
        setIsCC(true)
        handleClose()
    }
    //FILTER RANGE NUMBER
    const salary = [
        { id: 1, name: "5 triệu - 7 triệu", minPrice: 5000000, maxPrice: 7000000 },
        { id: 2, name: "7 triệu - 15 triệu", minPrice: 7000000, maxPrice: 15000000 },
        { id: 3, name: "Trên 15 triệu", minPrice: 15000000 }
    ]
    return isLoading ? <FuseLoading /> : <Fragment>
        {dataStatus ? <TicketStatus item={dataStatus} /> : <EmptyStatus />}
        <MaterialTable
            data={data}
            tableRef={tableRef}
            title={<>
                <Tooltip title="Tạo hồ sơ tuyển dụng">
                    <IconButton
                        onClick={() => setIsCreaterTicket(true)}
                        variant="contained"
                        color="secondary"
                        size="large">
                        <AddBoxIcon style={{ width: "22px", height: "22px", fill: "#61DBFB" }} />
                    </IconButton>
                </Tooltip>
            </>
            }
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
            actions={
                [
                    {
                        icon: 'search',
                        tooltip: 'Lọc',
                        isFreeAction: true,
                        onClick: (event) => setIsFiltering(state => !state)
                    },
                ]}
            editable={{
                isEditHidden: (rowData) => rowData,
            }}
            localization={{
                toolbar: { showColumnsTitle: "Hiển thị cột", },
                header: { actions: "" },
                body: { emptyDataSourceMessage: "Không có dữ liệu hiển thị..." }
            }}
            icons={{ ViewColumn: ViewColumnIcon, }}
            onRowClick={(event, rowData) => { setDataStatus(rowData) }}
            onChangeColumnHidden={(r) => {
                const index = hiddenColumns.findIndex(item => item === r.field)
                if (index !== -1) {
                    const flag = hiddenColumns.filter(item => item !== r.field)
                    setHiddenColumns([...flag])
                }
                else {
                    setHiddenColumns(prev => [...prev, r.field])
                }
            }}
        />
        < Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem style={MenuButton} onClick={handleEdit}>Chỉnh sửa</MenuItem>
            <MenuItem style={MenuButton} onClick={handleCopy}>Sao chép</MenuItem>
            <MenuItem style={MenuButton} onClick={handleCreate} disabled={isBlock}>Tạo hồ sơ</MenuItem>
        </Menu >
        {isCreateTicket &&
            <ModalCreateItem
                open={isCreateTicket}
                data={{ users: users, position: position }}
                handleClose={() => { setIsCreaterTicket(false) }}
            />
        }
        {isCC &&
            <CreateCandidate
                open={isCC}
                item={rowData}
                handleClose={() => { setIsCC(false) }}
            />}
        {
            isEditTicket &&
            <ModalEditItem
                open={isEditTicket}
                item={rowData}
                handleClose={() => { setIsEditTicket(false) }}
            />
        }
        {
            isCopyTicket &&
            <ModalCopyItem
                open={isCopyTicket}
                item={rowData}
                handleClose={() => { setIsCopyTicket(false) }}
            />
        }
    </Fragment >
}


