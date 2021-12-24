import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useLocation } from "react-router-dom"
import MaterialTable, { MTableAction } from '@material-table/core';
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { setDataTicket, refreshTicket } from 'app/store/fuse/ticketsSlice';
//ICON
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CachedIcon from '@mui/icons-material/Cached';
//MUI
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//COMPONENTS
import FuseLoading from '@fuse/core/FuseLoading';
import ModalEditItem from './ModalEditItem'
import ModalCreateItem from "./ModalCreateItem"
import ModalCopyItem from './ModalCopyItem'
import TicketStatus from './TicketStatus'
import CreateCandidate from '../candidate/CreateCandidate'
import CustomStep from './CustomStep'
import { CustomPosition, CustomName } from '../CustomField/CustomId'
import CustomNotice from './CustomNotice';
import CustomRenderCell from './CustomRenderCell'
import CustomFiltering from './CustomFiltering'
import { CustomDateEdit, CustomSelectEdit, CustomSelectPriceEdit, CustomAutocompleteEdit, CustomAutocompleteNameEdit } from '../CustomField/CustomEdit';
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
const getPriceValue = (array) => {
    const salary = [
        { id: 1, name: "5 triệu - 7 triệu", minPrice: 5000000, maxPrice: 7000000 },
        { id: 2, name: "7 triệu - 15 triệu", minPrice: 7000000, maxPrice: 15000000 },
        { id: 3, name: "Trên 15 triệu", minPrice: 15000000 }
    ]
    const valueArray = salary.map(item => array.includes(item.name) ? { minPrice: item.minPrice, maxPrice: item.maxPrice } : null)
    const minPrice = Math.min(...valueArray.filter(item => item !== null).map(item => item.minPrice))
    const maxPrice = Math.max(...valueArray.filter(item => item !== null).map(item => item.maxPrice))
    return { minPrice, maxPrice }
}
export default function Table() {
    const search = useLocation().search
    const queryParams = new URLSearchParams(search)
    const idParam = queryParams.get("id")
    //////////////////////////////////////////////////////////
    const dispatch = useDispatch()
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const flagTicket = useSelector(state => state.fuse.tickets.flagTicket)
    const position = useSelector(state => state.fuse.tickets.position)
    const users = useSelector(state => state.fuse.tickets.users)
    const user = JSON.parse(localStorage.getItem("profile"))
    const [rowData, setRowData] = useState({})
    const [initialData, setInitialData] = useState({})
    const [dataStatus, setDataStatus] = useState(null)
    const [isFiltering, setIsFiltering] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [isCC, setIsCC] = useState(false)
    const [isCreateTicket, setIsCreateTicket] = useState(false)
    const [isEditTicket, setIsEditTicket] = useState(false)
    const [isCopyTicket, setIsCopyTicket] = useState(false)
    const [isBlock, setIsBlock] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const [customNotice, setCustomNotice] = useState({})
    const tableRef = useRef();
    const headers = [
        {
            title: "#", field: "key", align: "center", hiddenByColumnsButton: true,
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
            ),
            filterComponent: props => { return <></> },
        },
        {
            title: "Vị trí tuyển dụng", field: "Vitri", cellStyle: { whiteSpace: 'nowrap' },
            render: rowData => (<CustomPosition data={rowData} />),
            filterComponent: props => {
                return <CustomAutocompleteEdit {...props} width={175} field="Thuoctinh" main="ticket" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { Vitri } = rowData;
                return term.map(item => parseInt(item.id)).includes(Vitri);
            },
        },
        { title: "Hiện có", field: "SLHT", type: 'numeric' },
        { title: "Cần tuyển", field: "SLCT", type: "numeric" },
        {
            title: "Mức lương dự kiến",
            field: "LuongDK",
            type: "currency",
            currencySetting: { locale: 'vi', currencyCode: "VND", minimumFractionDigits: 0 },
            filterComponent: props => {
                return <CustomSelectPriceEdit {...props} data={salary} width={150} field="LuongDK" />
            },
            customFilterAndSearch: (term, rowData) => {
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
                    value = JSON.parse(rowData['TNNS']).Ngayupdate
                    flag = false;
                }
                return flag ? <ClearIcon /> : new Date(value).toLocaleDateString("en-GB")
            },
            filterComponent: (props) => <CustomDateEdit {...props} />,
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true
                const time = Date.parse(JSON.parse(rowData.TNNS).Ngayupdate)
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
            render: (rowData) => {
                return (
                    <div className="renderHTML">
                        <Tooltip title="Mô tả">
                            <IconButton
                                onClick={(event) => { setCustomNotice({ open: true, data: rowData.Mota, field: "Mô tả tuyển dụng" }) }}
                                size="medium">
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <div dangerouslySetInnerHTML={{ __html: rowData.Mota }}></div>
                    </div>
                )
            },
        },
        {
            title: "Yêu cầu tuyển dụng",
            field: "Yeucau",
            render: (rowData) => (
                <div className="renderHTML">
                    <Tooltip title="Yêu cầu">
                        <IconButton
                            onClick={(event) => { setCustomNotice({ open: true, data: rowData.Yeucau, field: "Yêu cầu tuyển dụng" }) }}
                            size="medium">
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <div dangerouslySetInnerHTML={{ __html: rowData.Yeucau }}></div>
                </div>
            )
        },
        {
            title: "Chi phí tuyển dụng", field: "CPTD", cellStyle: { whiteSpace: 'nowrap' },
            render: (rowData) => {
                let flag = true;
                if (JSON.parse(rowData['Pheduyet'])[4]) {
                    flag = false;
                }
                return flag ? null : <CustomRenderCell data={rowData} />
            },
            filterComponent: props => {
                return <CustomFiltering {...props} />
            },
            customFilterAndSearch: (term, rowData) => {
                const { Nguon, CPDK, CPTT, CPCL } = term
                //Chi phí dự kiến
                const priceCPDK = CPDK.length !== 0 ? getPriceValue(CPDK) : []
                //Chi phí thực tế
                const priceCPTT = CPTT.length !== 0 ? getPriceValue(CPTT) : []
                //Chi phí còn lại
                const priceCPCL = CPCL.length !== 0 ? getPriceValue(CPCL) : []
                const main = JSON.parse(rowData.Pheduyet)[3]
                let mainSource = []
                let mainCPDK = []
                let mainCPTT = []
                let mainCPCL = []
                if (main?.CPTD) {
                    mainSource = main.CPTD.map(item => item.Nguon)
                    mainCPDK = main.CPTD.map(item => Number(item.Chiphi.split(",").join(''))).map(item => item >= priceCPDK.minPrice && (priceCPDK.maxPrice ? item < priceCPDK.maxPrice : true))
                    mainCPTT = main.CPTD.map(item => Number(item.Chiphi.split(",").join(''))).map(item => item >= priceCPTT.minPrice && (priceCPTT.maxPrice ? item < priceCPTT.maxPrice : true))
                    mainCPCL = main.CPTD.map(item => Number(item.Chiphi.split(",").join(''))).map(item => item >= priceCPCL.minPrice && (priceCPCL.maxPrice ? item < priceCPCL.maxPrice : true))
                }
                let sourceCondition = Nguon.length !== 0 ? mainSource.map(item => Nguon.includes(item)).includes(true) : true
                let CPDKCondition = priceCPDK.length !== 0 ? mainCPDK.includes(true) : true
                let CPTTCondition = priceCPTT.length !== 0 ? mainCPTT.includes(true) : true
                let CPCLCondition = priceCPCL.length !== 0 ? mainCPCL.includes(true) : true
                return sourceCondition && CPDKCondition && CPTTCondition && CPCLCondition
            },
        },
        {
            title: "Ban quản lí",
            cellStyle: { whiteSpace: 'nowrap' },
            field: "BQL",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BQL']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} setDataStatus={setDataStatus} />
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
                        <CustomStep key={item.id} item={item} data={rowData} setDataStatus={setDataStatus} />
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
                        <CustomStep key={item.id} item={item} data={rowData} setDataStatus={setDataStatus} />
                    )
                })
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ban kế toán ",
            cellStyle: { whiteSpace: 'nowrap' },
            field: "BKT",
            render: (rowData) => {
                const arraySteps = convertProperty(rowData['Pheduyet'])['BKT']
                return arraySteps.map(item => {
                    return (
                        <CustomStep key={item.id} item={item} data={rowData} setDataStatus={setDataStatus} />
                    )
                })
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ngày tạo",
            field: "Ngaytao",
            type: "date",
            dateSetting: { locale: "en-GB" },
            filterComponent: (props) => <CustomDateEdit {...props} />,
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true
                const time = Date.parse(rowData.Ngaytao)
                const beforeDate = Date.parse(term[0])
                const afterDate = Date.parse(term[1])
                return time >= beforeDate && time <= afterDate
            }
        },
        {
            title: "Người tạo",
            field: "idTao",
            cellStyle: { whiteSpace: 'nowrap' },
            render: rowData => (
                <CustomName data={rowData.idTao} />
            ),
            filterComponent: props => {
                return <CustomAutocompleteNameEdit {...props} width={175} field="name" main="ticket" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { idTao } = rowData;
                return term.map(item => parseInt(item.id)).includes(idTao);
            }
        }
    ];
    const isHiddenCols = localStorage.getItem("hidden")
    let isResult = []
    if (isHiddenCols) {
        isResult = isHiddenCols.split(",")
    }
    const flagColumns = headers.map(item => ({ ...item, align: "center", headerStyle: { whiteSpace: 'nowrap' }, hidden: !isResult.includes(item.field) }))
    const [columns, setColumns] = useState(flagColumns)
    const [hiddenColumns, setHiddenColumns] = useState(headers.map(item => item.field))
    useEffect(async () => {
        let isFetching = true;
        if (isFetching) {
            if (dataTicket.length === 0) {
                const [responseData, responsePosition, responseUser] = await Promise.all([
                    ticketsAPI.getTicket(),
                    ticketsAPI.getPosition(),
                    ticketsAPI.getUser()
                ])
                const { data: { attributes: { Dulieu } } } = responsePosition
                const { data } = responseUser
                const dataUser = data.map(({ attributes }) => ({ id: attributes.id, name: attributes.name, position: JSON.parse(attributes.Profile)?.Vitri, PQTD: JSON.parse(attributes.Profile)?.PQTD }))
                dispatch(setDataTicket({ data: responseData.data, position: Dulieu, users: dataUser }))
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
            }
        }
        return () => {
            isFetching = false;
        }
    }, [])
    useEffect(() => {
        let isFetching = true
        if (isFetching) {
            localStorage.setItem("hidden", hiddenColumns);
        }
        return () => {
            isFetching = false
        }
    }, [hiddenColumns])
    useEffect(() => {
        if (idParam) {
            const data = flagTicket.filter(item => item.key == idParam)
            dispatch(refreshTicket(data))
        }
    }, [idParam])
    const handleClick = (event, row) => {
        setRowData(row);
        setAnchorEl(event.currentTarget);
        setIsBlock(row.Trangthai != 2 ? true : false)
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
    const handleRefresh = () => {
        setIsFiltering(false)
        dispatch(refreshTicket([]))
        setTimeout(() => {
            dispatch(refreshTicket([...flagTicket]))
        }, 0)
    }
    //FILTER RANGE NUMBER
    const salary = [
        { id: 1, name: "5 triệu - 7 triệu", minPrice: 5000000, maxPrice: 7000000 },
        { id: 2, name: "7 triệu - 15 triệu", minPrice: 7000000, maxPrice: 15000000 },
        { id: 3, name: "Trên 15 triệu", minPrice: 15000000 }
    ]
    return isLoading ? <FuseLoading /> :
        <Fragment>
            {dataStatus
                ?
                <TicketStatus item={dataStatus} isHidden={!isHidden} setIsHidden={() => { setIsHidden(state => !state) }} />
                :
                null
            }
            <MaterialTable
                data={dataTicket}
                tableRef={tableRef}
                title={<>
                    <Tooltip title="Tạo hồ sơ tuyển dụng">
                        <div>
                            <IconButton
                                onClick={() => setIsCreateTicket(true)}
                                variant="contained"
                                color="secondary"
                                disabled={!user.profile.PQTD.includes(5)}
                                size="large">
                                <AddBoxIcon style={{ width: "22px", height: "22px", fill: "#61DBFB" }} />
                            </IconButton>
                        </div>
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
                    toolbarButtonAlignment: "left",
                    rowStyle: rowData => {
                        let selected = dataStatus && dataStatus.tableData.id === rowData.tableData.id;
                        return {
                            backgroundColor: selected ? "#3b5998" : "#FFF",
                            color: selected ? "#fff" : "#000",
                        };
                    },

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
                        {
                            icon: !isHidden ? 'visibility_off' : 'visibility',
                            tooltip: 'Trạng thái',
                            isFreeAction: true,
                            onClick: (event) => setIsHidden(state => !state)
                        },
                        {
                            icon: 'refresh',
                            tooltip: "Đặt lại",
                            isFreeAction: true,
                            onClick: (event) => { handleRefresh() }
                        }
                    ]}
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
                        labelRowsSelect: "phiếu"
                    }
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
                <MenuItem style={MenuButton} onClick={handleEdit} disabled={[2, 3].includes(rowData.Trangthai)}>Chỉnh sửa</MenuItem>
                <MenuItem style={MenuButton} onClick={handleCopy}>Sao chép</MenuItem>
                <MenuItem style={MenuButton} onClick={handleCreate} disabled={isBlock}>Tạo hồ sơ</MenuItem>
            </Menu >
            {/* CREATE TICKET  */}
            {isCreateTicket &&
                <ModalCreateItem
                    open={isCreateTicket}
                    data={{ users: users, position: position }}
                    handleClose={() => { setIsCreateTicket(false) }}
                />
            }
            {/* CREATE CANDIDATE  */}
            {isCC &&
                <CreateCandidate
                    open={isCC}
                    item={rowData}
                    handleClose={() => { setIsCC(false) }}
                />}
            {/* EDIT TICKET  */}
            {
                isEditTicket &&
                <ModalEditItem
                    open={isEditTicket}
                    item={rowData}
                    handleClose={() => { setIsEditTicket(false) }}
                />
            }
            {/* COPY TICKET  */}
            {
                isCopyTicket &&
                <ModalCopyItem
                    open={isCopyTicket}
                    data={{ users: users, position: position }}
                    item={rowData}
                    handleClose={() => { setIsCopyTicket(false) }}
                />
            }
            {/* DETAIL DECRIPTIONS / REQUIREMENTS  */}
            {Object.keys(customNotice).length !== 0 &&
                <CustomNotice
                    item={customNotice}
                    handleClose={() => { setCustomNotice({}) }}
                />}
        </Fragment >
}


