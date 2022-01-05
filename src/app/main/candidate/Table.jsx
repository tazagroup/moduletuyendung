import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useLocation } from "react-router-dom"
//REDUX
import { useDispatch, useSelector, batch } from 'react-redux';
import { setDataTicket, setSource } from 'app/store/fuse/ticketsSlice';
import { setDataCandidate, updateFlagCandidate, refreshDataCandidate } from 'app/store/fuse/candidateSlice';
//MUI
import MaterialTable, { MTableAction } from '@material-table/core';
import { Tooltip, Menu, MenuItem } from '@mui/material/';
import { styled } from '@mui/material/styles'
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh'
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
//COMPONENTS
import FuseLoading from '@fuse/core/FuseLoading';
import CreateCandidate from '../candidate/CreateCandidate'
import InfoCandidate from './InfoCandidate';
import { CustomCV, CustomStatus, CustomExperts, CustomTimeline, CustomSelect } from './CustomCell'
import { CustomName } from '../CustomField/CustomId'
import { CustomDateEdit, CustomAutocompleteNameEdit, CustomFileEdit, CustomAutocompleteEdit } from '../CustomField/CustomEdit';
//API
import ticketsAPI from 'api/ticketsAPI';
import candidatesAPI from 'api/candidatesAPI';

const TextTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      font-size: .8em;
  `);
const Table = () => {
    const search = useLocation().search
    const queryParams = new URLSearchParams(search)
    const idParam = queryParams.get("idhash")
    ///////////////////////////////////////////////
    const dispatch = useDispatch();
    const data = useSelector(state => state.fuse.candidates.dataCandidate)
    const flagCandidate = useSelector(state => state.fuse.candidates.flagCandidate)
    const flagDataCandidate = useSelector(state => state.fuse.candidates.flagDataCandidate)
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket).filter(item => item.Trangthai == 2)
    const position = useSelector(state => state.fuse.tickets.position)
    const source = useSelector(state => state.fuse.tickets.source)
    const [rowData, setRowData] = useState({})
    const [isFiltering, setIsFiltering] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [initialData, setInitialData] = useState({})
    const open = Boolean(anchorEl)
    const tableRef = useRef();
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
                return <CustomStatus item={item} field="Duyet" />
            }
        },
        {
            title: "Xác nhận phỏng vấn", field: "XNPV",
            render: rowData => {
                const item = JSON.parse(rowData['XacnhanHS'])?.XNPV
                const status = [2, 3].includes(JSON.parse(rowData['DanhgiaHS'])?.Trangthai)
                const check = JSON.parse(rowData['XacnhanHS']).hasOwnProperty('XNPV') && !status
                return check ? <CustomStatus item={item} field="XNPV" /> : <ClearIcon />
            }
        },
        {
            title: "Trạng thái", field: "Trangthai", lookup: { 0: "Đang xử lí", 1: "Đạt", 2: "Loại" }
        },
        {
            title: "CV", field: "CV",
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
            const dataUser = data.map(({ attributes }) => ({ id: attributes.id, name: attributes.name, position: JSON.parse(attributes.Profile)?.Vitri, PQTD: JSON.parse(attributes.Profile)?.PQTD }))
            batch(() => {
                dispatch(setDataTicket({ data: responseData.data, position: Dulieu, users: dataUser }))
                dispatch(setSource(responseSource.data))
            })
            setIsLoading(false)
        }
        const responseCandidate = await candidatesAPI.getCandidate()
        const mainCandidate = responseCandidate.data.map(item => item.attributes)
        let idTicket = []
        if (responseData.data) {
            idTicket = responseData.data.map(item => item.attributes).filter(item2 => item2.Trangthai == 2).map(opt => opt.id)
        }
        else {
            idTicket = dataTicket.map(item => item.key)
        }
        const mainData = mainCandidate.filter(item2 => idTicket.includes(item2.idTicket))
        dispatch(setDataCandidate({ main: mainData, dashboard: mainCandidate }))
        setIsLoading(false)
        return () => {

        }
    }, [])
    //FILTER TO ID
    useEffect(() => {
        if (idParam) {
            const data = flagDataCandidate.filter(item => item.key == idParam)
            dispatch(refreshDataCandidate(data))
        }
    }, [idParam])
    useEffect(() => {
        if (JSON.stringify(rowData) != JSON.stringify(flagCandidate)) {
            dispatch(updateFlagCandidate(rowData))
        }
        return () => {
        }
    }, [rowData])
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
    const handleRefresh = () => {
        setIsFiltering(false)
        dispatch(refreshDataCandidate([]))
        setTimeout(() => {
            dispatch(refreshDataCandidate([...flagDataCandidate]))
        }, 0)
    }
    return isLoading ? <FuseLoading /> :
        <Fragment>
            <MaterialTable
                data={data}
                initialFormData={initialData}
                tableRef={tableRef}
                title={<>
                    <TextTooltip title="Tạo hồ sơ ứng viên">
                        <IconButton
                            onClick={() => { setIsCreating(true) }}
                            variant="contained"
                            color="secondary"
                            size="large">
                            <AddBoxIcon style={{ width: "22px", height: "22px", fill: "#61DBFB" }} />
                        </IconButton>
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
                onRowClick={(event, rowData) => { setRowData(rowData) }}
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
