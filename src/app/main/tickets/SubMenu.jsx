import React, { useState } from "react";
import MaterialTable from "@material-table/core";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};
const arrayType = {
    positions: ["IT", "Marketing", "Telesale"],
}
export default function App() {
    const [posName, setPosName] = React.useState([]);

    const columns = [
        {
            title: "Name",
            field: "name",
            filterComponent: (props) => {
                return (
                    <>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={posName}
                                onChange={(event) => {
                                    const { target: { value } } = event;
                                    props.onFilterChanged(props.columnDef.tableData.id, value)
                                }}
                                renderValue={(selected) => selected.join(", ")}
                                MenuProps={MenuProps}
                            >
                                {arrayType['positions'].map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={posName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                );
            },
            customFilterAndSearch: (term, rowData) => {
                setPosName(term)
            }
        }
    ];
    const [data, setData] = useState([{ Vitri: "IT" }]);
    return (
        <MaterialTable
            columns={columns}
            data={data}
            options={{
                filtering: true
            }}
        ></MaterialTable>
    );
}
