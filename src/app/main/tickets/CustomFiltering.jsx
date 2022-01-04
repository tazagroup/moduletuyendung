import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Grid, Autocomplete, TextField, Checkbox, FormControl, Select, ListItemText, MenuItem, InputLabel } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const CustomFiltering = (props) => {
    const tickets = useSelector(state => state.fuse.tickets.dataTicket)
    const source = useSelector(state => state.fuse.tickets.source)
    const mainSource = Array.prototype.concat.apply([], tickets.map(item => JSON.parse(item.Pheduyet)[3]?.CPTD))
    const arraySource = [...new Set(mainSource.map(opt => opt?.Nguon))]
    const [filterValue, setFilterValue] = useState({ Nguon: "", CPDK: [], CPTT: [], CPCL: [] })
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
    const salary = [
        { id: 1, name: "5 triệu - 7 triệu", minPrice: 5000000, maxPrice: 7000000 },
        { id: 2, name: "7 triệu - 15 triệu", minPrice: 7000000, maxPrice: 15000000 },
        { id: 3, name: "Trên 15 triệu", minPrice: 15000000 }
    ]
    const handleOnChange = (e, field) => {
        const value = { ...filterValue }
        value[field] = e
        setFilterValue(value)
        props.onFilterChanged(props.columnDef.tableData.id, value);
    }
    const convertIdToName = (id) => {
        return source.find(opt => opt.id == id)?.Thuoctinh
    }
    return (
        <Grid container spacing={2} style={{ width: "500px", paddingTop: "2.5px" }}>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={arraySource}
                    fullWidth
                    onChange={(event, newValue) => {
                        handleOnChange(newValue, "Nguon")
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Nguồn"
                        />
                    )}
                    getOptionLabel={(option) => convertIdToName(option)}
                    renderOption={(props, option, { selected }) => {
                        return (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {source.find(opt => opt.id == option)?.Thuoctinh}
                            </li>
                        )
                    }}
                    renderTags={(selected) => {
                        return selected.map(item => convertIdToName(item)).join(',')
                    }}
                    style={{ marginTop: "5.5px" }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl sx={{ marginTop: "12.5px" }} variant="standard" fullWidth>
                    <InputLabel shrink={true}>Chi phí dự kiến</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        fullWidth
                        value={filterValue.CPDK}
                        onChange={(event) => {
                            const { target: { value } } = event;
                            handleOnChange(value, 'CPDK')
                        }}
                        renderValue={(selected) => {
                            return ""
                        }}
                        MenuProps={MenuProps}
                    >
                        {salary.map((item) => (
                            <MenuItem
                                key={item.id}
                                value={item.name}
                            >
                                <Checkbox
                                    checked={filterValue.CPDK.find((option) => option === item.name) ? true : false}
                                />
                                <ListItemText primary={`${item.name}`} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl sx={{ marginTop: "12.5px" }} variant="standard" fullWidth>
                    <InputLabel shrink={true}>Chi phí thực tế</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={filterValue.CPTT}
                        onChange={(event) => {
                            const { target: { value } } = event;
                            handleOnChange(value, 'CPTT')
                        }}
                        renderValue={(selected) => {
                            return ""
                        }}
                        MenuProps={MenuProps}
                    >
                        {salary.map((item) => (
                            <MenuItem
                                key={item.id}
                                value={item.name}
                            >
                                <Checkbox
                                    checked={filterValue.CPTT.find((option) => option === item.name) ? true : false}
                                />
                                <ListItemText primary={`${item.name}`} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl sx={{ marginTop: "12.5px" }} variant="standard" fullWidth>
                    <InputLabel shrink={true}>Chi phí còn lại</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={filterValue.CPCL}
                        onChange={(event) => {
                            const { target: { value } } = event;
                            handleOnChange(value, 'CPCL')
                        }}
                        renderValue={(selected) => {
                            return ""
                        }}
                        MenuProps={MenuProps}
                    >
                        {salary.map((item) => (
                            <MenuItem
                                key={item.id}
                                value={item.name}
                            >
                                <Checkbox
                                    checked={filterValue.CPCL.find((option) => option === item.name) ? true : false}
                                />
                                <ListItemText primary={`${item.name}`} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    )
}

export default CustomFiltering
