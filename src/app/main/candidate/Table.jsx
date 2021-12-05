import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidates } from 'app/store/fuse/candidateSlice';

import MaterialTable, { MTableAction, MTableEditField } from '@material-table/core';
import { Tooltip, Menu, MenuItem } from '@mui/material/';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FuseLoading from '@fuse/core/FuseLoading';
import CreateCandidate from '../candidate/CreateCandidate'
import InfoCandidate from './InfoCandidate';
import { CustomStatus, CustomCV } from './CustomCell'
import { CustomDateEdit, CustomSelectEdit, CustomFileEdit, CustomSelectNumber } from '../CustomField/CustomEdit';
import axios from 'axios'
const Table = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.fuse.candidates.dataCandidate)
    const loading = useSelector(state => state.fuse.candidates.isLoading)
    const [rowData, setRowData] = useState({})
    const [isFiltering, setIsFiltering] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading,setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const tableRef = useRef();
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
    useEffect(() => {
        dispatch(fetchCandidates())
    }, [])  
    const headers = [
        { title: "", field: "id", render: rowData => null, filterComponent: rowData => null },
        {
            title: "#", field: "key", align: "center",
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
            filterComponent: props => {
                const data = ["IT", "Marketing", "Telesale"]
                return <CustomSelectEdit {...props} data={data} width={125} field="Vitri" collection="candidates" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { Vitri } = rowData;
                return term.includes(Vitri);
            }
        },
        {
            title: "Nguồn tuyển dụng", field: "Nguon",
            filterComponent: props => {
                const data = ["Facebook", "ITViec", "TopCV"]
                return <CustomSelectEdit {...props} data={data} width={125} field="Nguon" collection="candidates" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0) return true;
                const { Nguon } = rowData;
                return term.includes(Nguon);
            }
        },
        {
            title: "Ngày ứng tuyển", field: "NgayUT",
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
        { title: "Tên", field: "Hoten" },
        { title: "Email", field: "Email" },
        {
            title: "Duyệt CV", field: "DuyetCV",
            render: rowData => (<CustomStatus item={rowData} field="DuyetCV" />),
            filterComponent: props => {
                const data = ["Đã duyệt", "Chưa duyệt", "Từ chối"]
                return <CustomSelectNumber {...props} data={data} width={130} field="DuyetCV" collection="candidates" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0 || term.length === 3) return true;
                const { DuyetCV } = rowData;
                return term.includes("Đã duyệt")
            }
        },
        {
            title: "Xác nhận phỏng vấn", field: "MoiPV",
            render: rowData => (<CustomStatus item={rowData} field="MoiPV" />),
            emptyValue: rowData => (<ClearIcon />),
            filterComponent: props => {
                const data = ["Đã duyệt", "Chưa duyệt", "Từ chối"]
                return <CustomSelectNumber {...props} data={data} width={130} field="MoiPV" collection="candidates" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0 || term.length === 2) return true;
                const { DuyetCV } = rowData;
                if (term.length === 1) {
                    return term.includes("Đã duyệt") ? DuyetCV === true : DuyetCV === false
                }
            }
        },
        {
            title: "CV", field: "CV",
            render: rowData => (<CustomCV item={rowData.CV} />),
            filterComponent: props => {
                const data = ["xlsx", "docx", "pdf"]
                return <CustomFileEdit {...props} data={data} width={130} field="CV" />
            },
            customFilterAndSearch: (term, rowData) => {
                if (term.length === 0 || term.length === 3) return true;
                const { CV } = rowData;
                const type = CV.split('%2F')[1].split('?alt')[0].split('.')[1]
                return term.includes(type)
            }
        }
    ]
    const columns = headers.map(item => ({ ...item, align: "center", cellStyle: { whiteSpace: 'nowrap' }, headerStyle: { whiteSpace: 'nowrap' } }))
    return loading ? <FuseLoading /> :
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
                    data={rowData}
                    handleClose={() => { setIsEditing(false) }}
                />}
        </Fragment>
}

export default Table
