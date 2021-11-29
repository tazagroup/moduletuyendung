import React from 'react'
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

const CustomSelectEdit = (props) => {
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
                        console.log(value)
                        props.onFilterChanged(props.columnDef.tableData.id, value);
                    }}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                >
                    {props.data.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={value.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    )

}

const CustomSelectPriceEdit = (props) => {
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
                            <ListItemText primary={item.name} />
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
const CustomSliderEdit = (props) => {
    const marks = [{ value: 0, label: '0đ', }, { value: 8000000, label: '8.000.000đ', }, { value: 15000000, label: '+15.000.000đ', },];
    return (
        <Slider
            aria-label="Custom marks"
            defaultValue={0}
            step={null}
            max={15000000}
            valueLabelDisplay="auto"
            marks={marks}
            onChange={(e, newValue) => props.onFilterChanged(props.columnDef.tableData.id, newValue !== 0 ? newValue : 0)}
        />
    )
}
export { CustomDateEdit, CustomSelectEdit, CustomSelectPriceEdit, CustomSliderEdit }
