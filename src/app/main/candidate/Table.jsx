import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useLocation } from "react-router-dom"
//REDUX
import { useDispatch, useSelector, batch } from 'react-redux';
import { setDataTicket, setSource } from 'app/store/fuse/ticketsSlice';
import candidateSlice, { setDataCandidate, updateFlagCandidate, refreshDataCandidate, removeCandidate, setFlagRender } from 'app/store/fuse/candidateSlice';
import { setDataReason } from 'app/store/fuse/guideSlice'
//MUI
import MaterialTable, { MTableAction } from '@material-table/core';
import { Tooltip, Menu, MenuItem, TextField, FormControl, Select, Checkbox, ListItemText, styled } from '@mui/material/';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HelpIcon from '@mui/icons-material/Help';
import RefreshIcon from '@mui/icons-material/Refresh'
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import DownloadIcon from '@mui/icons-material/Download';
//COMPONENTS
import Status from './Status'
import FlagStatus from './FlagStatus'
import FuseLoading from '@fuse/core/FuseLoading';
import CreateCandidate from '../candidate/CreateCandidate'
import InfoCandidate from './InfoCandidate';
import { CustomCV, CustomStatus, CustomExperts, CustomTimeline, CustomSelect } from './CustomCell'
import { CustomName } from '../CustomField/CustomId'
import { CustomDateEdit, CustomAutocompleteNameEdit, CustomFileEdit, CustomAutocompleteEdit } from '../CustomField/CustomEdit';
import XLSX from 'xlsx'
import Swal from 'sweetalert2';
//API
import ticketsAPI from 'api/ticketsAPI';
import candidatesAPI from 'api/candidatesAPI';
import guidesAPI from 'api/guideAPI'
const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: .8em;
  `);
const CustomFilter = (props) => {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            }
        }
    };
    const value = props.columnDef.tableData.filterValue || []
    return (
        <>
            <FormControl sx={{ m: 1, width: props.width, marginTop: "15.5px" }} variant="standard">
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={value}
                    onChange={(event) => {
                        const { target: { value } } = event;
                        props.onFilterChanged(props.columnDef.tableData.id, value);
                    }}
                    renderValue={(selected) => {
                        return ""
                    }}
                    MenuProps={MenuProps}
                >
                    {props.data.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                            <Checkbox
                                checked={value.indexOf(item.id) > -1}
                            />
                            <ListItemText primary={`${item.value}`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}
const Table = () => {
    const search = useLocation().search
    const queryParams = new URLSearchParams(search)
    const idParam = queryParams.get("idhash")
    ///////////////////////////////////////////////
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("profile"))
    let data = useSelector(state => state.fuse.candidates.dataCandidate)
    data = idParam ? data.filter(item => item.key == idParam) : data
    const flagCandidate = useSelector(state => state.fuse.candidates.flagCandidate)
    const flagRender = useSelector(state => state.fuse.candidates.flagRender)
    const flagDataCandidate = useSelector(state => state.fuse.candidates.flagDataCandidate)
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket).filter(item => item.Trangthai == 2)
    const position = useSelector(state => state.fuse.tickets.position)
    const source = useSelector(state => state.fuse.tickets.source)
    const [flagData, setFlagData] = useState(null)
    const [rowData, setRowData] = useState(null)
    const [isFiltering, setIsFiltering] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [initialData, setInitialData] = useState({})
    const open = Boolean(anchorEl)
    const tableRef = useRef(null);

    const headers = [
        {
            title: "#", field: "key", align: "center", hiddenByColumnsButton: true,
            filterComponent: props => { return <></> },
            render: rowData => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            render: rowData => {
                const position = dataTicket.find(item => item.key == rowData.idTicket)
                return (<div>{getPositionById(position?.Vitri)}</div>)
            },
            filterComponent: props => {
                return <CustomAutocompleteEdit {...props} width={175} field="Thuoctinh" main="candidate" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { idTicket } = rowData;
                const item = dataTicket.find(opt => opt.key == idTicket).Vitri
                const positionId = term.map(item => item.id)
                return positionId.includes(item)
            }
        },
        {
            title: "Nguồn tuyển dụng", field: "Nguon",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return (<div>{source.find(opt => opt.id == profile?.Nguon)?.Thuoctinh}</div>)
            },
            filterComponent: props => {
                return <CustomSelect {...props} />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length == 0) return true
                const main = JSON.parse(rowData.Profile).Nguon
                return term.includes(main)
            }
        },
        {
            title: "Ngày ứng tuyển", field: "NgayUT",
            type: "date",
            dateSetting: { locale: "en-GB" },
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return new Date(profile?.NgayUT).toLocaleDateString("en-GB")
            },
            filterComponent: (props) => <CustomDateEdit {...props} />,
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true
                const time = Date.parse(rowData.NgayUT)
                const beforeDate = Date.parse(term[0])
                const afterDate = Date.parse(term[1])
                return time >= beforeDate && time <= afterDate
            },
            customSort: (a, b) => {
                const prevDate = new Date(JSON.parse(a.Profile)?.NgayUT).getTime()
                const nextDate = new Date(JSON.parse(b.Profile)?.NgayUT).getTime()
                return nextDate - prevDate
            }
        },
        {
            title: "Tên", field: "Hoten",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return (<div>{profile?.Hoten}</div>)
            },
            filterComponent: ({ columnDef, onFilterChanged }) => (
                <TextField
                    id="standard-basic"
                    variant="standard"
                    onChange={(e) => {
                        onFilterChanged(columnDef.tableData.id, e.target.value);
                    }}
                    style={{ marginTop: 2, minWidth: 140 }}
                />
            ),
            customFilterAndSearch: (term, rowData) => {
                const profile = JSON.parse(rowData.Profile).Hoten
                return profile.includes(term)
            }
        },
        {
            title: "Email", field: "Email",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return (<div>{profile?.Email}</div>)
            },
            customFilterAndSearch: (term, rowData) => {
                const profile = JSON.parse(rowData.Profile).Email
                return profile.includes(term)
            }
        },
        {
            title: "Số điện thoại", field: "Phone",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return profile ? <div>{profile?.Phone}</div> : <ClearIcon />
            },
            customFilterAndSearch: (term, rowData) => {
                const profile = JSON.parse(rowData.Profile).Phone
                return profile.includes(term)
            }
        },
        {
            title: "Duyệt hồ sơ", field: "Duyet",
            render: rowData => {
                const item = JSON.parse(rowData['XacnhanHS'])?.Duyet
                return <CustomStatus censor={item?.Nguoiduyet} item={item?.status} error={JSON.parse(rowData?.Lydo)?.id} field="Duyet" />
            },
            filterComponent: (props) => {
                const data = [{ id: 0, value: "Chờ xử lí" }, { id: 1, value: "Duyệt" }, { id: 2, value: "Từ chối" }]
                return <CustomFilter {...props} data={data} />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length == 3) return true
                const item = JSON.parse(rowData['XacnhanHS'])?.Duyet?.status
                return term.includes(item)
            }
        },
        {
            title: "Xác nhận phỏng vấn", field: "XNPV",
            render: rowData => {
                const item = JSON.parse(rowData['XacnhanHS'])?.XNPV
                const status = [2, 3].includes(JSON.parse(rowData['DanhgiaHS'])?.Trangthai)
                const check = JSON.parse(rowData['XacnhanHS']).hasOwnProperty('XNPV') && !status
                return check ? <CustomStatus censor={item?.Nguoiduyet} item={item?.status} error={JSON.parse(rowData?.Lydo)?.id} field="XNPV" /> : <ClearIcon />
            },
            filterComponent: (props) => {
                const data = [{ id: 0, value: "Chờ xử lí" }, { id: 1, value: "Duyệt" }, { id: 2, value: "Từ chối" }]
                return <CustomFilter {...props} data={data} />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length == 3) return true
                const item = JSON.parse(rowData['XacnhanHS'])?.XNPV?.Trangthai
                return term.includes(item)
            }
        },
        {
            title: "Trạng thái", field: "Trangthai", lookup: { 0: "Đang xử lí", 1: "Đạt", 2: "Loại" },
            render: rowData => {
                const item = rowData.Trangthai
                const text = (item == 1 ? "Đạt" : "Đang xử lí")
                return item == 2 ? (
                    <TextTooltip title={JSON.parse(rowData.Lydo).text}>
                        <div>
                            Loại
                        </div>
                    </TextTooltip>
                ) : (
                    <div>{text}</div>
                )
            }
        },
        {
            title: "Hồ sơ", field: "CV",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return <CustomCV item={profile.CV} />
            },
            filterComponent: props => {
                return <></>
            },
        },
        {
            title: "Ban chuyên môn", field: "BCM",
            render: rowData => {
                const check = JSON.parse(rowData['DuyetHS'])
                return (Object.keys(check).length != 0 && typeof (check) != "string") && <CustomExperts item={rowData} field="DuyetSPV" />
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ban quản lí", field: "BQL",
            render: rowData => {
                const check = JSON.parse(rowData['DuyetHS'])
                return Object.keys(check).length >= 2 && typeof (check) != "string" ? <CustomExperts item={rowData} field="DuyetQL" /> : <></>
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ban tuyển dụng", field: "BTD",
            render: rowData => {
                const check = JSON.parse(rowData['DuyetHS'])
                return Object.keys(check).length >= 3 ? <CustomTimeline item={rowData} /> : <></>
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
            render: rowData => (
                <CustomName data={rowData.idTao} />
            ),
            filterComponent: props => {
                return <CustomAutocompleteNameEdit {...props} width={175} field="name" main="candidate" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { idTao } = rowData;
                return term.map(item => parseInt(item.id)).includes(idTao);
            }
        }
    ]
    const isHiddenCols = localStorage.getItem("hidden2")
    let isResult = []
    if (isHiddenCols) {
        isResult = isHiddenCols.split(",")
    }
    const flag = isResult.length != 0 ? isResult : headers.map(item => item.field)
    const [hiddenColumns, setHiddenColumns] = useState([...flag])
    const [reset, setReset] = useState(false)
    const columns = headers.map(item => ({ ...item, align: "center", cellStyle: { whiteSpace: 'nowrap' }, headerStyle: { whiteSpace: 'nowrap' }, hidden: !isResult.includes(item.field) }))
    //FETCH DATA
    useEffect(async () => {
        let [responseData, responsePosition, responseUser, responseSource] = [[], [], [], []]
        if (dataTicket.length === 0) {
            [responseData, responsePosition, responseUser, responseSource] = await Promise.all([
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
        }
        const responseCandidate = await candidatesAPI.getCandidate()
        const mainCandidate = responseCandidate.data.map(item => item.attributes)
        let idTicket = dataTicket.map(item => item.key)
        const mainData = mainCandidate.filter(item2 => idTicket.includes(item2.idTicket))
        dispatch(setDataCandidate({ main: mainData, dashboard: mainCandidate }))
        setIsLoading(false)
        return () => {
        }
    }, [isLoading])
    useEffect(() => {
        let flag = true;
        async function getData() {
            const response = await guidesAPI.getError()
            const data = JSON.parse(response.data.attributes.Dulieu)
            const result = data.map(item => {
                return { id: item.id, Thuoctinh: item.Thuoctinh }
            })
            dispatch(setDataReason(result))
        }
        if (flag) {
            getData()
        }
        return () => flag = false
    }, [])
    //FILTER TO ID
    useEffect(() => {
        if (idParam) {
            const data = flagDataCandidate.filter(item => item.key == idParam)
            dispatch(refreshDataCandidate(data))
        }
    }, [idParam])
    //HIDDEN COLUMNS
    useEffect(() => {
        localStorage.setItem("hidden2", hiddenColumns);
        setReset(state => !state)
    }, [hiddenColumns])
    //FUNCTIONS
    const getPositionById = (id) => {
        return position.find(item => item.id == id)?.Thuoctinh
    }
    const handleClick = (event, row) => {
        setRowData(row);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = (e) => {
        handleClose()
        dispatch(updateFlagCandidate(rowData))
        setIsEditing(true)
    }
    const handleDelete = async (e) => {
        handleClose()
        Swal.fire({
            icon: 'error',
            title: 'Xác nhận xóa hồ sơ ứng viên ?',
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
                const response = await candidatesAPI.updateCandidate(bodyData, bodyData.key)
                dispatch(removeCandidate(response.data.attributes))
            }
        })

    }
    const handleRefresh = () => {
        tableRef.current.dataManager.currentPage = 0;
        dispatch(setFlagRender(null))
        setIsFiltering(false)
        dispatch(refreshDataCandidate([]))
        setTimeout(() => {
            dispatch(refreshDataCandidate([...flagDataCandidate]))
        }, 0)
    }
    const handleRowClick = (rowData) => {
        if (JSON.stringify(rowData) != JSON.stringify(flagCandidate)) {
            dispatch(updateFlagCandidate(rowData))
        }
        dispatch(setFlagRender(tableRef.current?.state?.data))
    }
    const convertValue = (value) => {
        return value != 0 ? (value == 1 ? "Đã duyệt" : "Từ chối") : "Đang xử lí"
    }
    const handleExport = () => {
        const flag = data
        const dataExcel = flag.map(item => {
            const ticket = dataTicket.find(opt => opt.key == item.idTicket)
            const profile = JSON.parse(item.Profile)
            const approve = JSON.parse(item.XacnhanHS)
            const calendar = JSON.parse(item.LichPV)?.VongPV
            const judge = JSON.parse(item.DanhgiaHS)
            const check = JSON.parse(item.DuyetHS)
            return {
                "Vị trí": position.find(opt => opt.id == ticket.Vitri)?.Thuoctinh,
                "Họ tên": profile.Hoten,
                "Email": profile.Email,
                "Số điện thoại": profile.Phone,
                "Nguồn ứng tuyển": profile.Nguon,
                "Ngày ứng tuyển": new Date(profile.NgayUT).toLocaleDateString("en-GB"),
                "Bước 1": convertValue(1),
                "Bước 2": approve?.Duyet ? convertValue(approve.Duyet.status) : "",
                "Bước 3": approve?.XNPV ? convertValue(approve.XNPV.status) : "",
                "Bước 4": calendar ? convertValue(calendar[0].Trangthai) : "",
                "Bước 5": calendar && calendar.length > 1 ? convertValue(calendar.slice(-1)[0].Trangthai) : "",
                "Bước 6": Object.keys(judge).length !== 0 ? convertValue(Object.keys(judge).length !== 0 ? 1 : 0) : "",
                "Bước 7": Object.keys(check).length >= 2 ? convertValue(check.DuyetQL.Trangthai) : "",
                "Bước 8": Object.keys(check).length >= 2 ? convertValue(check.DuyetTD.Trangthai) : "",
                "Trạng thái": convertValue(item.Trangthai)
            }
        })
        const workSheet = XLSX.utils.json_to_sheet(dataExcel)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, "Hồ sơ ứng viên")
        //buffer
        let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
        //binary
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //download
        XLSX.writeFile(workBook, "Ungvien.xlsx")
    }
    const handleCheck = () => {
        const flag = data
        const result = flag.filter(item => {
            const lastStage = JSON.parse(item.LichPV)
            const DuyetHS = JSON.parse(item.DuyetHS)
            const approveStep = Object.keys(DuyetHS).slice(-1)
            const currentApprove = DuyetHS[approveStep[0]]
            const XacnhanHS = JSON.parse(item.XacnhanHS)
            const checkStep = Object.keys(XacnhanHS).slice(-1)
            const currentCheck = XacnhanHS[checkStep[0]]
            if (currentCheck?.status == 0) return (currentCheck.Nguoiduyet == user.profile.id)
            else if (currentApprove?.Trangthai == 0) return (currentApprove.Nguoiduyet == user.profile.id)
            else if (Object.keys(lastStage).length != 0) {
                const current = lastStage.VongPV.slice(-1)[0]
                return (current.status == 0 && lastStage.Nguoiduyet == user.profile.id)
            }
            return false
        })
        dispatch(refreshDataCandidate([...result]))
    }
    return isLoading ? <FuseLoading /> :
        <Fragment>
            {rowData ? <Status /> : <FlagStatus />}
            <MaterialTable
                data={flagRender ? (flagRender.length != 0 ? flagRender : data) : data}
                initialFormData={initialData}
                tableRef={tableRef}
                title={<>
                    <TextTooltip title="Tạo hồ sơ ứng viên">
                        <div>
                            <IconButton
                                onClick={() => { setIsCreating(true) }}
                                variant="contained"
                                color="secondary"
                                size="large"
                                disabled={!user.profile.PQTD.includes(2)}
                            >
                                <AddBoxIcon style={{ width: "22px", height: "22px", fill: "#61DBFB" }} />
                            </IconButton>
                        </div>
                    </TextTooltip>
                </>}
                actions={[
                    {
                        icon: 'search',
                        tooltip: 'Lọc',
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
                            <TextTooltip title="Xuất Excel">
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
                    }
                ]}
                components={{
                    Action: props => {
                        if (props.action.tooltip === "Add") {
                            return <div></div>
                        }
                        return <MTableAction {...props} />
                    },
                }}
                columns={columns}
                editable={{
                    isEditHidden: (rowData) => rowData,
                }}
                onRowClick={(event, rowData) => handleRowClick(rowData)}
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
                    maxBodyHeight: 310,
                    headerStyle: { position: "sticky", top: 0 },
                    showDetailPanelIcon: false,
                    columnsButton: true,
                    search: false,
                    paging: true,
                    filtering: isFiltering,
                    toolbarButtonAlignment: "left",
                    rowStyle: rowData => {
                        let selected = flagCandidate && flagCandidate.tableData?.id === rowData.tableData.id;
                        return {
                            backgroundColor: selected ? "#3b5998" : "#FFF",
                            color: selected ? "#fff" : "#000",
                        };
                    },
                }}
                icons={{ ViewColumn: ViewColumnIcon, }}
            >
            </MaterialTable>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEdit}>Thông tin</MenuItem>
                <MenuItem onClick={handleDelete}>Xóa</MenuItem>
            </Menu>
            {isCreating &&
                <CreateCandidate
                    open={isCreating}
                    handleClose={() => { setIsCreating(false) }}
                />}
            {isEditing &&
                <InfoCandidate
                    open={isEditing}
                    handleClose={() => { setIsEditing(false) }}
                />}
        </Fragment>
}

export default Table
