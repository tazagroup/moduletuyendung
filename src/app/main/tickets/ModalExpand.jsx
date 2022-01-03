import React from 'react'
import { useSelector } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';



const ModalExpand = ({ open, data, handleClose }) => {
    const sources = useSelector(state => state.fuse.tickets.source)
    const dataTable = data.map(({ Chiphi, CPTT, CPCL, ...item }) => ({
        ...item,
        Nguon: sources.find(opt => opt.id == item.Nguon).Thuoctinh,
        Chiphi: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Chiphi || 0),
        CPTT: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(CPTT || 0),
        CPCL: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Chiphi - CPTT || 0)
    }))
    return (
        <Dialog
            fullWidth={true}
            maxWidth={'md'}
            open={open}
            onClose={handleClose}
        >
            <DialogTitle style={{ textAlign: "center", fontSize: "25px" }}>Chi phí tuyển dụng</DialogTitle>
            <DialogContent>
                <div style={{ maxWidth: '100%' }}>
                    <Table
                        headerHeight={20}
                        width={852}
                        height={300}
                        rowHeight={30}
                        rowGetter={({ index }) => dataTable[index]}
                        rowCount={dataTable.length}
                    >
                        <Column label='Nguồn' dataKey='Nguon' width={100} />
                        <Column label='Chi phí dự kiến' dataKey='Chiphi' width={140} />
                        <Column label='Chi phí thực tế' dataKey='CPTT' width={140} />
                        <Column label='Chi phí còn lại' dataKey='CPCL' width={140} />
                        <Column label='Hình thức thanh toán' dataKey='Hinhthuc' width={200} />
                    </Table>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog>
    )
}

export default ModalExpand
