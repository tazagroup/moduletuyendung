import React from 'react'
import { useSelector } from "react-redux"
import { DatePicker } from "react-rainbow-components";
import ClearIcon from '@mui/icons-material/Clear';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Slider from '@mui/material/Slider';
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
    return array.filter(item => item[`${field}`] === value).length
}
const countBoolean = (array, field, value) => {
    const trueVariable = array.filter(item => item[`${field}`] === true).length
    const falseVariable = array.filter(item => item[`${field}`] === false).length
    return value === "Đã duyệt" ? trueVariable : falseVariable
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
const CustomSelectEdit = (props) => {
    const { collection = "" } = props
    const arrayTicket = useSelector(state => state.fuse.tickets.dataTicket)
    const arrayCandidate = useSelector(state => state.fuse.candidates.dataCandidate)
    const compareArray = collection ? arrayCandidate : arrayTicket

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
                    {props.data.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={value.indexOf(name) > -1} />
                            <ListItemText primary={`${name} (${countProperty(compareArray, props.field, name)})`} />
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
const CustomSelectBoolean = (props) => {
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
                            <ListItemText primary={`${item} (${countBoolean(arrayCandidate, props.field, item)})`} />
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
export { CustomDateEdit, CustomSelectEdit, CustomSelectPriceEdit, CustomSelectBoolean, CustomFileEdit }
