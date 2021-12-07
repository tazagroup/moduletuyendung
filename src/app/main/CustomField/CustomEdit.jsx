import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { DatePicker } from "react-rainbow-components";
import { TextField, MenuItem, FormControl, ListItemText } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Select from "@mui/material/Select";
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from "@mui/material/Checkbox";
import ticketsAPI from "api/ticketsAPI"
const containerStyles = {
    width: 300,
    position: "relative"
};

const countProperty = (array, field, value) => {
    if (field === "Lydo") {
        const arrayReason = ["Tuyển mới", "Thay thế", "Dự phòng nhân lực"]
        const inArrayReason = array.filter(item => arrayReason.includes(item.Lydo)).length
        return arrayReason.includes(value) ? array.filter(item => item['Lydo'] === value).length : (array.length - inArrayReason)
    }
    else if (field === "Nguon" || "Hinhthuc") {
        const step = array.map(item => JSON.parse(item['Pheduyet']))
        return step.filter(item => {
            if (item[2]) return item[1][`${field}`] === value
        }).length
    }
    return array.filter(item => item[`${field}`] === value).length
}
const countNumber = (array, field, value) => {
    const fulfiledVariable = array.filter(item => item[`${field}`] === 1).length
    const rejectedVariable = array.filter(item => item[`${field}`] === -1).length
    const pendingVariable = array.filter(item => item[`${field}`] === 0).length
    return value !== "Chưa duyệt" ? (value === "Đã duyệt" ? fulfiledVariable : rejectedVariable) : pendingVariable
}
const countFile = (array, field, value) => {
    const fileArray = array.map(item => item[`${field}`].split('%2F')[1].split('?alt')[0].split('.')[1])
    const pdfFile = fileArray.filter(item => item === "pdf").length
    const docxFile = fileArray.filter(item => item === "docx").length
    const xlsxFile = fileArray.filter(item => item === "xlsx").length
    return value !== "xlsx" ? (value === "pdf" ? pdfFile : docxFile) : xlsxFile
}
const countObjectProperty = (array, field, value) => {
    const { minPrice, maxPrice } = value
    return array.filter(item => item[`${field}`] >= minPrice && (maxPrice ? item[`${field}`] <= maxPrice : true)).length
}
const CustomAutocompleteEdit = (props) => {
    const [arrayData, setArrayData] = useState(props.data ? props.data : [])
    useEffect(async () => {
        const { columnDef: { field } } = props
        if (field === "Vitri") {
            const response = await ticketsAPI.getPosition();
            const { data: { attributes: { Dulieu } } } = response
            setArrayData(JSON.parse(Dulieu))
        }
    }, [])
    const { field } = props
    const value = props.columnDef.tableData.filterValue || []
    return (
        <>
            <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={arrayData}
                value={value}
                onChange={(event, newValue) => {
                    props.onFilterChanged(props.columnDef.tableData.id, newValue);
                }}
                style={{ width: props.width }}
                getOptionLabel={(option) => option[`${field}`]}
                renderOption={(props, option, { selected }) => {
                    return (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option[`${field}`]}
                        </li>
                    )
                }}
                renderTags={(selected) => {
                    return selected.map(item => item[`${field}`]).join(',')
                }}
                renderInput={(params) => (
                    <TextField {...params} variant="standard" />
                )}
            />
        </>
    )
}
const CustomSelectEdit = (props) => {
    const arrayTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: props.width
            }
        }
    };
    const value = props.columnDef.tableData.filterValue || []
    return (
        <>
            <FormControl sx={{ m: 1, width: props.width, marginTop: "20.5px" }} variant="standard">
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={value}
                    onChange={(event) => {
                        const { target: { value } } = event;
                        props.onFilterChanged(props.columnDef.tableData.id, value);
                    }}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {props.data.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            <Checkbox
                                checked={value.indexOf(item) > -1}
                            />
                            <ListItemText primary={`${item} (${countProperty(arrayTicket, props.field, item)})`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}
const CustomSelectPriceEdit = (props) => {
    const arrayTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: props.width
            }
        }
    };
    const value = props.columnDef.tableData.filterValue || []
    return (
        <>
            <FormControl sx={{ m: 1, width: props.width, marginTop: "20.5px" }} variant="standard">
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={value}
                    onChange={(event) => {
                        const { target: { value } } = event;
                        props.onFilterChanged(props.columnDef.tableData.id, value);
                    }}
                    renderValue={(selected) => ""}
                    MenuProps={MenuProps}
                >
                    {props.data.map((item) => (
                        <MenuItem key={item.id} value={item}>
                            <Checkbox
                                checked={value.find((option) => option.id === item.id) ? true : false}
                            />
                            <ListItemText primary={`${item.name} (${countObjectProperty(arrayTicket, props.field, item)})`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}
const CustomDateEdit = (props) => {
    const value = props.columnDef.tableData.filterValue;
    return (
        <div className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
            style={containerStyles}
        >
            <DatePicker
                id="calendar-15"
                selectionType="range"
                value={value}
                onChange={(e) => props.onFilterChanged(props.columnDef.tableData.id, e)}
            />
            <ClearIcon className='clear__button' onClick={(e) => props.onFilterChanged(props.columnDef.tableData.id, [])} />
        </div>
    )
}
const CustomSelectNumber = (props) => {
    const arrayCandidate = useSelector(state => state.fuse.candidates.dataCandidate)
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: props.width
            }
        }
    };
    const value = props.columnDef.tableData.filterValue || []
    return (
        <>
            <FormControl sx={{ m: 1, width: props.width, marginTop: "20.5px" }} variant="standard">
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={value}
                    onChange={(event) => {
                        const { target: { value } } = event;
                        props.onFilterChanged(props.columnDef.tableData.id, value);
                    }}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                >
                    {props.data.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            <Checkbox
                                checked={value.indexOf(item) > -1}
                            />
                            <ListItemText primary={`${item} (${countNumber(arrayCandidate, props.field, item)})`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}

//NAME - TYPE - FILE
const convertFileName = (value) => {
    const arrayObj = [
        { name: "Docx", type: "docx" },
        { name: "Excel", type: "xlsx" },
        { name: "PDF", type: "pdf" },
    ]
    return arrayObj.filter(item => item.type === value)[0]['name']
}
const CustomFileEdit = (props) => {
    const arrayCandidate = useSelector(state => state.fuse.candidates.dataCandidate)

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: props.width
            }
        }
    };
    const value = props.columnDef.tableData.filterValue || []
    return (
        <>
            <FormControl sx={{ m: 1, width: props.width, marginTop: "20.5px" }} variant="standard">
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={value}
                    onChange={(event) => {
                        const { target: { value } } = event;
                        props.onFilterChanged(props.columnDef.tableData.id, value);
                    }}
                    renderValue={(selected) => selected.map(item => convertFileName(item)).join(", ")}
                    MenuProps={MenuProps}
                >
                    {props.data.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={value.indexOf(name) > -1} />
                            <ListItemText primary={`${convertFileName(name)} (${countFile(arrayCandidate, props.field, name)})`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )
}


export {
    CustomDateEdit,
    CustomAutocompleteEdit,
    CustomSelectPriceEdit,
    CustomSelectNumber,
    CustomFileEdit,
    CustomSelectEdit
}
