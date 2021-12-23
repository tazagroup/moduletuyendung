import React, { Fragment, useRef, useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { setDataTicket } from 'app/store/fuse/ticketsSlice';
import { setDataCandidate, updateFlagCandidate } from 'app/store/fuse/candidateSlice';
//MUI
import MaterialTable, { MTableAction, MTableEditField } from '@material-table/core';
import { Tooltip, Menu, MenuItem } from '@mui/material/';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
//COMPONENTS
import FuseLoading from '@fuse/core/FuseLoading';
import CreateCandidate from '../candidate/CreateCandidate'
import InfoCandidate from './InfoCandidate';
import { CustomCV, CustomStatus, CustomExperts } from './CustomCell'
import { CustomName } from '../CustomField/CustomId'
import { CustomDateEdit, CustomAutocompleteNameEdit, CustomFileEdit, CustomAutocompleteEdit } from '../CustomField/CustomEdit';

//API
import ticketsAPI from 'api/ticketsAPI';
import candidatesAPI from 'api/candidatesAPI';
const Table = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.fuse.candidates.dataCandidate)
    const flagCandidate = useSelector(state => state.fuse.candidates.flagCandidate)
    const dataTicket = useSelector(state => state.fuse.tickets.dataTicket).filter(item => item.Trangthai == 2)
    const position = useSelector(state => state.fuse.tickets.position)
    const [rowData, setRowData] = useState({})
    const [isFiltering, setIsFiltering] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl)
    const tableRef = useRef();
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
    useEffect(async () => {
        if (dataTicket.length === 0) {
            const [responseData, responsePosition, responseUser] = await Promise.all([
                ticketsAPI.getTicket(),
                ticketsAPI.getPosition(),
                ticketsAPI.getUser(),
            ])
            const { data: { attributes: { Dulieu } } } = responsePosition
            const { data } = responseUser
            const dataUser = data.map(({ attributes }) => ({ id: attributes.id, name: attributes.name, position: JSON.parse(attributes.Profile)?.Vitri, PQTD: JSON.parse(attributes.Profile)?.PQTD }))
            dispatch(setDataTicket({ data: responseData.data, position: Dulieu, users: dataUser }))
            setIsLoading(false)
        }
        const responseCandidate = await candidatesAPI.getCandidate()
        dispatch(setDataCandidate(responseCandidate))
        setIsLoading(false)
    }, [])
    useEffect(() => {
        if (JSON.stringify(rowData) != JSON.stringify(flagCandidate)) {
            dispatch(updateFlagCandidate(rowData))
        }
    }, [rowData])
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
                const profile = JSON.parse(rowData.Profile)
                return (<div>{getPositionById(position?.Vitri)}</div>)
            },
            filterComponent: props => {
                return <CustomAutocompleteEdit {...props} width={175} field="Thuoctinh" main="candidate" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { Vitri } = rowData;
                return term.includes(Vitri);
            }
        },
        {
            title: "Nguồn tuyển dụng", field: "Nguon",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return (<div>{profile?.Nguon}</div>)
            }
            // filterComponent: props => {
            //     const data = ["Facebook", "ITViec", "TopCV"]
            //     return <CustomSelectEdit {...props} data={data} width={125} field="Nguon" collection="candidates" />
            // },
            // customFilterAndSearch: (term, rowData) => {
            //     if (term.length === 0) return true;
            //     const { Nguon } = rowData;
            //     return term.includes(Nguon);
            // }
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
            }
        },
        {
            title: "Tên", field: "Hoten",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return (<div>{profile?.Hoten}</div>)
            }
        },
        {
            title: "Email", field: "Email",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return (<div>{profile?.Email}</div>)
            }
        },
        {
            title: "Số điện thoại", field: "Phone",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return profile ? <div>{profile?.Phone}</div> : <ClearIcon />
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
            title: "CV", field: "CV",
            render: rowData => {
                const profile = JSON.parse(rowData.Profile)
                return <CustomCV item={profile.CV} />
            },
            filterComponent: props => {
                const data = ["xlsx", "docx", "pdf"]
                return <CustomFileEdit {...props} data={data} width={130} field="CV" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const profile = JSON.parse(rowData.Profile)
                const type = profile.CV.split('%2F')[1].split('?alt')[0].split('.')[1]
                return term.includes(type)
            }
        },
        {
            title: "Ban chuyên môn", field: "BCM",
            render: rowData => {
                const check = JSON.parse(rowData['DuyetHS'])
                return Object.keys(check).length != 0 ? <CustomExperts item={rowData} /> : <></>
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ban quản lí", field: "BQL",
            render: rowData => {
                return <></>
            },
            filterComponent: (rowData) => <></>
        },
        {
            title: "Ban tuyển dụng", field: "BTD",
            render: rowData => {
                return <></>
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
                return <CustomAutocompleteNameEdit {...props} width={175} field="name" main="ticket" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { idTao } = rowData;
                return term.map(item => parseInt(item.id)).includes(idTao);
            }
        }
    ]
    const columns = headers.map(item => ({ ...item, align: "center", cellStyle: { whiteSpace: 'nowrap' }, headerStyle: { whiteSpace: 'nowrap' } }))
    return isLoading ? <FuseLoading /> :
        <Fragment>
            <MaterialTable
                tableRef={tableRef}
                title={<>
                    <Tooltip title="Tạo hồ sơ ứng viên">
                        <IconButton
                            onClick={() => { setIsCreating(true) }}
                            variant="contained"
                            color="secondary"
                            size="large">
                            <AddBoxIcon style={{ width: "22px", height: "22px", fill: "#61DBFB" }} />
                        </IconButton>
                    </Tooltip>
                </>}
                actions={[
                    {
                        icon: 'search',
                        tooltip: 'Lọc',
                        isFreeAction: true,
                        onClick: (event) => setIsFiltering(state => !state)
                    },
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
                data={data}
                editable={{
                    isEditHidden: (rowData) => rowData,
                }}
                onRowClick={(event, rowData) => { setRowData(rowData) }}
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
                <MenuItem onClick={handleEdit}>Chỉnh sửa</MenuItem>
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
