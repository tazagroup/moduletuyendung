import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useLocation } from "react-router-dom"
import MaterialTable, { MTableAction } from '@material-table/core';
//REDUX
import { useDispatch, useSelector, batch } from 'react-redux';
import { setDataTicket, refreshTicket, setSource, removeTicket, setFlagTicket } from 'app/store/fuse/ticketsSlice';
//ICON
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import HelpIcon from '@mui/icons-material/Help';
//MUI
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from "@mui/material/styles"
//COMPONENTS
import FuseLoading from '@fuse/core/FuseLoading';
import ModalEditItem from './ModalEditItem'
import ModalCreateItem from "./ModalCreateItem"
import ModalCopyItem from './ModalCopyItem'
import TicketStatus from './TicketStatus'
import TicketStatusFlag from './TicketStatusFlag'
import CreateCandidate from '../candidate/CreateCandidate'
import CustomStep from './CustomStep'
import { CustomPosition, CustomName } from '../CustomField/CustomId'
import CustomNotice from './CustomNotice';
import CustomRenderCell from './CustomRenderCell'
import CustomFiltering from './CustomFiltering'
import { CustomDateEdit, CustomSelectEdit, CustomSelectPriceEdit, CustomAutocompleteEdit, CustomAutocompleteNameEdit } from '../CustomField/CustomEdit';
import XLSX from 'xlsx'
import Swal from 'sweetalert2';
//UTILS
import { ConvertPermissionArray } from '../utils/index';
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
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: .8em;
  `);
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
    const idParam = queryParams.get("idhash")
    //////////////////////////////////////////////////////////
    const dispatch = useDispatch()
    let dataTicket = useSelector(state => state.fuse.tickets.dataTicket)
    dataTicket = idParam ? dataTicket.filter(item => item.key == idParam) : dataTicket
    const renderTicket = useSelector(state => state.fuse.tickets.flagRenderTicket)
    const flagTicket = useSelector(state => state.fuse.tickets.flagTicket)
    const position = useSelector(state => state.fuse.tickets.position)
    const users = useSelector(state => state.fuse.tickets.users)
    const user = JSON.parse(localStorage.getItem("profile"))
    const [flagData, setFlagData] = useState(null)
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
    const [customNotice, setCustomNotice] = useState({})
    const disabledButton = user.profile?.PQTD.includes(1)
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
            render: props => {
                let { min, max } = JSON.parse(props.LuongDK)
                min = min && new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(min || 0)
                max = max && new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(max || 0)
                return <div style={{ whiteSpace: "nowrap" }}>{`${min}${max ? ` - ${max}` : ""}`}</div>
            },
            filterComponent: props => {
                return <CustomSelectPriceEdit {...props} data={salary} width={170} field="LuongDK" />
            },
            customFilterAndSearch: (term, rowData) => {
                const { min, max } = JSON.parse(rowData.LuongDK)
                const minPrice = Math.min(...term.map(item => item.minPrice))
                const maxPrice = Math.max(...term.map(item => item.maxPrice))
                if (!maxPrice) {
                    return max ? max >= minPrice : min >= minPrice
                }
                if (max) return min >= minPrice && max <= maxPrice
                return min >= minPrice && min <= maxPrice
            }
        },
        {
            title: "Thời gian thử việc",
            field: "TGThuviec",
            type: "numeric",
            render: data => (
                <div>{data.TGThuviec} tháng</div>
            )
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
                        <TextTooltip title="Mô tả">
                            <IconButton
                                onClick={(event) => { setCustomNotice({ open: true, data: rowData.Mota, field: "Mô tả tuyển dụng" }) }}
                                size="medium">
                                <VisibilityIcon />
                            </IconButton>
                        </TextTooltip>
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
                    <TextTooltip title="Yêu cầu">
                        <IconButton
                            onClick={(event) => { setCustomNotice({ open: true, data: rowData.Yeucau, field: "Yêu cầu tuyển dụng" }) }}
                            size="medium">
                            <VisibilityIcon />
                        </IconButton>
                    </TextTooltip>
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
    const columns = headers.map(item => ({ ...item, align: "center", headerStyle: { whiteSpace: 'nowrap' }, hidden: !isResult.includes(item.field) }))
    const flag = isResult.length != 0 ? isResult : headers.map(item => item.field)
    const [hiddenColumns, setHiddenColumns] = useState([...flag])
    const [reset, setReset] = useState(false)
    //FETCH DATA
    useEffect(async () => {
        let isFetching = true;
        if (isFetching) {
            if (dataTicket.length === 0) {
                const [responseData, responsePosition, responseUser, responseSource] = await Promise.all([
                    ticketsAPI.getTicket(),
                    ticketsAPI.getPosition(),
                    ticketsAPI.getUser(),
                    ticketsAPI.getSource()
                ])
                const { data: { attributes: { Dulieu } } } = responsePosition
                const { data } = responseUser
                const dataUser = data.map(({ attributes }) => ({ id: attributes.id, name: attributes.name, position: JSON.parse(attributes.Profile)?.Vitri, Profile: JSON.parse(attributes.Profile), PQTD: JSON.parse(attributes.Profile)?.PQTD }))
                batch(() => {
                    dispatch(setDataTicket({ data: responseData.data, position: Dulieu, users: dataUser }))
                    dispatch(setSource(responseSource.data))
                })
                setIsLoading(false)
            }
            else { setIsLoading(false) }
        }
        return () => {
            isFetching = false;
        }
    }, [])
    useEffect(() => {
        localStorage.setItem("hidden", hiddenColumns);
        setReset(state => !state)
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
    const handleDelete = async () => {
        handleClose()
        Swal.fire({
            icon: 'error',
            title: 'Xác nhận xóa yêu cầu tuyển dụng ?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Xác nhận',
            denyButtonText: `Hủy`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const bodyData = {
                    ...rowData,
                    published: 1
                }
                const response = await ticketsAPI.updateTicket(bodyData, bodyData.key)
                dispatch(removeTicket(bodyData))
            }
        })
    }
    const handleRefresh = () => {
        tableRef.current.dataManager.currentPage = 0;
        setDataStatus(null)
        dispatch(setFlagTicket(null))
        setIsFiltering(false)
        dispatch(refreshTicket([]))
        setTimeout(() => {
            dispatch(refreshTicket([...flagTicket]))
        }, 0)
    }
    const convertValue = (value) => {
        return value != 0 ? (value == 1 ? "Đã duyệt" : "Từ chối") : "Đang xử lí"
    }
    const handleExport = () => {
        const flag = dataTicket
        const data = flag.map(item => {
            const receive = JSON.parse(item.TNNS)
            const checkReceive = Object.keys(receive)
            const steps = JSON.parse(item?.Pheduyet)
            return {
                "Vị trí": position.find(opt => opt.id == item.Vitri)?.Thuoctinh,
                "Số lượng hiện tại": item?.SLHT,
                "Số lượng cần tuyển": item?.SLCT,
                "Lương dự kiến": item?.LuongDK,
                "Thời gian thử việc": item?.TGThuviec + " tháng",
                "Tiếp nhận nhân sự": checkReceive.length != 0 ? "Đã tiếp nhận" : "Chưa tiếp nhận",
                "Lí do": item?.Lydo,
                "Bước 1": steps[0] ? convertValue(steps[0].status) : "Chờ xử lí",
                "Bước 2": steps[1] ? convertValue(steps[1].status) : "Chờ xử lí",
                "Bước 3": steps[2] ? convertValue(steps[2].status) : "Chờ xử lí",
                "Bước 4": steps[3] ? convertValue(steps[3].status) : "Chờ xử lí",
                "Bước 5": steps[4] ? convertValue(steps[4].status) : "Chờ xử lí",
                "Bước 6": steps[5] ? convertValue(steps[5].status) : "Chờ xử lí",
                "Bước 7": steps[6] ? convertValue(steps[6].status) : "Chờ xử lí",
                "Trạng thái": convertValue(item.Trangthai)
            }
        })
        const workSheet = XLSX.utils.json_to_sheet(data)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, "Yêu cầu tuyển dụng")
        //buffer
        let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
        //binary
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //download
        XLSX.writeFile(workBook, "Tickets.xlsx")
    }
    const handleCheck = () => {
        const approveArray = dataTicket.filter(item => {
            const flag = JSON.parse(item.Pheduyet).slice(-1)
            const value = flag[0].Nguoiduyet
            return value.includes(user.profile.id) && flag[0].status == 0
        })
        dispatch(refreshTicket([...approveArray]))
    }
    const handleRowClick = (rowData) => {
        dispatch(setFlagTicket(tableRef.current?.state?.data))
        setDataStatus(rowData)
    }
    //FILTER RANGE NUMBER
    const salary = [
        { id: 1, name: "5 triệu - 7 triệu", minPrice: 5000000, maxPrice: 7000000 },
        { id: 2, name: "7 triệu - 15 triệu", minPrice: 7000000, maxPrice: 15000000 },
        { id: 3, name: "Trên 15 triệu", minPrice: 15000000 }
    ]
    return isLoading ? <FuseLoading /> :
        <Fragment>
            {dataStatus || idParam
                ?
                <TicketStatus item={idParam ? dataTicket[0] : dataStatus} />
                :
                <TicketStatusFlag />
            }
            <MaterialTable
                data={renderTicket ? (renderTicket.length != 0 ? renderTicket : dataTicket) : dataTicket}
                tableRef={tableRef}
                title={<>
                    <TextTooltip title="Tạo hồ sơ tuyển dụng">
                        <div>
                            <IconButton
                                onClick={() => setIsCreateTicket(true)}
                                variant="contained"
                                color="secondary"
                                size="large"
                                disabled={!disabledButton}
                            >
                                <AddBoxIcon style={{ width: "22px", height: "22px", fill: "#61DBFB" }} />
                            </IconButton>
                        </div>
                    </TextTooltip>
                </>
                }
                initialFormData={initialData}
                options={{
                    maxBodyHeight: 380,
                    headerStyle: { position: "sticky", top: 0 },
                    showDetailPanelIcon: false,
                    columnsButton: true,
                    search: false,
                    paging: true,
                    filtering: isFiltering,
                    toolbarButtonAlignment: "left",
                    pageSize: 10,       // make initial page size
                    pageSizeOptions: [10, 25, 50],
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
                            icon: () => (
                                <TextTooltip title="Lọc">
                                    <SearchIcon />
                                </TextTooltip>
                            ),
                            isFreeAction: true,
                            onClick: (event) => setIsFiltering(state => !state)
                        },
                        {
                            icon: () => (
                                <TextTooltip title="Đặt lại">
                                    <RefreshIcon />
                                </TextTooltip>
                            ),
                            isFreeAction: true,
                            onClick: (event) => { handleRefresh() }
                        },
                        {
                            icon: () => (
                                <TextTooltip title="Xuất excel">
                                    <DownloadIcon />
                                </TextTooltip>
                            ),
                            isFreeAction: true,
                            onClick: (event) => { handleExport() }
                        },
                        {
                            icon: () => (
                                <TextTooltip title="Xử lí">
                                    <HelpIcon />
                                </TextTooltip>
                            ),
                            isFreeAction: true,
                            onClick: (event) => { handleCheck() }
                        },
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
                onRowClick={(event, rowData) => { handleRowClick(rowData) }}
                onChangeColumnHidden={(r) => {
                    const index = hiddenColumns.findIndex(item => item === r.field)
                    if (index !== -1) {
                        const flag = hiddenColumns.filter(item => item !== r.field)
                        setHiddenColumns(flag)
                    }
                    else {
                        setHiddenColumns([...hiddenColumns, r.field])
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
                <MenuItem style={MenuButton} onClick={handleDelete} disabled={user.profile.id != rowData.idTao}>Xóa hồ sơ</MenuItem>
                {/* {excelData && (
                    <ExcelFile element={(
                        <MenuItem style={MenuButton} onClick={() => { setAnchorEl(null) }}>Xuất Excel</MenuItem>
                    )}>
                        <ExcelSheet dataSet={excelData} name="Yêu cầu tuyển dụng">
                            {Object.keys(excelData).map((item, index) => (
                                <ExcelColumn key={index} label={item} value={item} />
                            ))}
                        </ExcelSheet>
                    </ExcelFile>
                )} */}
            </Menu >
            {/* CREATE TICKET  */}
            {
                isCreateTicket &&
                <ModalCreateItem
                    open={isCreateTicket}
                    data={{ users: users, position: position }}
                    handleClose={() => { setIsCreateTicket(false) }}
                />
            }
            {/* CREATE CANDIDATE  */}
            {
                isCC &&
                <CreateCandidate
                    open={isCC}
                    item={rowData}
                    handleClose={() => { setIsCC(false) }}
                />
            }
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
            {
                Object.keys(customNotice).length !== 0 &&
                <CustomNotice
                    item={customNotice}
                    handleClose={() => { setCustomNotice({}) }}
                />
            }
        </Fragment >
}


