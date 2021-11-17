import React, { useRef, useState } from "react";
import MaterialTable from "@material-table/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function App() {
  const [rowData, setRowData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const tableRef = React.useRef();
  const [columns, setColumns] = useState([
    {
      title: "cutomerId",
      field: "cutomerId"
    },
    {
      title: "name",
      field: "name"
    },
    {
      title: "description",
      field: "description"
    }
  ]);
  const [data,setData] = useState([
    { cutomerId: 1, name: "client1", description: "client1" },
    { cutomerId: 2, name: "client2", description: "client2" },
    { cutomerId: 3, name: "client3", description: "client3" },
    { cutomerId: 4, name: "client4", description: "client4" }
  ]);
  const open = Boolean(anchorEl);
  const handleClick = (event, row) => {
    setRowData(row);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
};
const handleEdit = () => {
  setAnchorEl(null);
  tableRef.current.dataManager.changeRowEditing(rowData, 'update');
  tableRef.current.setState({
      ...tableRef.current.dataManager.getRenderState(),
      showAddRow: false
  });
}
const handleCopy = () => {
  setAnchorEl(null);
  tableRef.current.dataManager.changeRowEditing();
  tableRef.current.setState({
      ...tableRef.current.dataManager.getRenderState(),
      showAddRow: !tableRef.current.state.showAddRow
  });
  console.log(tableRef.current.state)
}
  return (
    <div className="App">
      <h1>Editing bug</h1>
      <MaterialTable
        tableRef={tableRef}
        options={{
          actionsColumnIndex: -1,
          showDetailPanelIcon: false,
          columnsButton: true
        }}
        columns={columns}
        data={data}
        actions={[
          {
            icon: MoreVertIcon,
            tooltip: "Menu",
            isFreeAction: false,
            onClick: (event, row) => {
              handleClick(event, row);
            }
          }
        ]}
        editable={{
          onRowAdd: (newData) =>
              Promise.resolve(setData([...data, newData])),
          onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                  setTimeout(() => {
                      const dataUpdate = [...data];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      setData([...dataUpdate]);
                      resolve();
                  }, 1000);
              }),
      }}
      />
      <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleCopy}>Copy</MenuItem>
            </Menu>
    </div>
  );
}
