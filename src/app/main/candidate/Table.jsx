import React, { Fragment, useRef, useState, useEffect } from 'react'
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { setDataTicket } from 'app/store/fuse/ticketsSlice';
import { setDataCandidate } from 'app/store/fuse/candidateSlice';
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
import { CustomStatus, CustomCV } from './CustomCell'
import { CustomDateEdit, CustomSelectEdit, CustomFileEdit, CustomAutocompleteEdit } from '../CustomField/CustomEdit';
//API
import ticketsAPI from 'api/ticketsAPI';
import candidatesAPI from 'api/candidatesAPI';
const Table = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.fuse.candidates.dataCandidate)
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
    const headers = [
        {
            title: "#", field: "key", align: "center",
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
        // {
        //     title: "Duyệt CV", field: "DuyetCV",
        //     render: rowData => (<CustomStatus item={rowData} field="DuyetCV" />),
        //     filterComponent: props => {
        //         const data = ["Đã duyệt", "Chưa duyệt", "Từ chối"]
        //         return <CustomSelectNumber {...props} data={data} width={130} field="DuyetCV" collection="candidates" />
        //     },
        //     customFilterAndSearch: (term, rowData) => {
        //         if (term.length === 0 || term.length === 3) return true;
        //         const { DuyetCV } = rowData;
        //         return term.includes("Đã duyệt")
        //     }
        // },
        // {
        //     title: "Xác nhận phỏng vấn", field: "MoiPV",
        //     render: rowData => (<CustomStatus item={rowData} field="MoiPV" />),
        //     emptyValue: rowData => (<ClearIcon />),
        //     filterComponent: props => {
        //         const data = ["Đã duyệt", "Chưa duyệt", "Từ chối"]
        //         return <CustomSelectNumber {...props} data={data} width={130} field="MoiPV" collection="candidates" />
        //     },
        //     customFilterAndSearch: (term, rowData) => {
        //         if (term.length === 0 || term.length === 2) return true;
        //         const { DuyetCV } = rowData;
        //         if (term.length === 1) {
        //             return term.includes("Đã duyệt") ? DuyetCV === true : DuyetCV === false
        //         }
        //     }
        // },
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
                localization={{
                    toolbar: { showColumnsTitle: "Hiển thị cột" },
                    header: { actions: "" },
                    body: { emptyDataSourceMessage: "Không có dữ liệu hiển thị..." }
                }}
                options={{
                    showDetailPanelIcon: false,
                    columnsButton: true,
                    search: false,
                    paging: true,
                    filtering: isFiltering,
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
                    item={rowData}
                    open={isEditing}
                    handleClose={() => { setIsEditing(false) }}
                />}
        </Fragment>
}

export default Table
