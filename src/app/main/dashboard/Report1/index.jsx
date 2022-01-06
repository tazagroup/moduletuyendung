import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography } from '@mui/material'
import Main from './Main'
import Sub from './Sub'
import Table from './Table'
const convertIdToName = (arr, id) => {
    return arr.find(opt => opt.id == id).Thuoctinh
}
const countSum = (array) => {
    return array.reduce((sum, a) => sum + a, 0);
}
const mergeDuplicateObject = (array, field) => {

}
const Report1 = () => {
    const dataTicket = useSelector(state => state.fuse.tickets.dashboardTicket)
    const dataCandidate = useSelector(state => state.fuse.candidates.dashboardCandidate)
    const positionArray = useSelector(state => state.fuse.tickets.position)
    const approveCandidate = dataCandidate.filter(item => item.Trangthai == 1).map(item => item.idTicket)
    let main = dataTicket.reduce(function (accumulator, cur) {
        let Vitri = cur.Vitri
        let found = accumulator.find(function (elem) {
            return elem.Vitri == Vitri
        });
        if (found) {
            const flag = { ...found }
            const index = accumulator.map(item => item.key).indexOf(flag.key)
            flag['SLHT'] += cur.SLHT
            flag['SLCT'] += cur.SLCT
            accumulator[index] = { ...flag }
        }
        else accumulator.push(cur);
        return accumulator;
    }, []);
    const positionLabels = main.map(item => convertIdToName(positionArray, item.Vitri))
    const firstData = [...main.map(item => item.SLHT)] // sum of duplicate object
    const secondData = [...main.map(item => item.SLCT)]
    const thirdData = [countSum(firstData), countSum(secondData)]
    const [selectedData, setSelectedData] = useState([])
    const [select, setSelect] = useState(null)
    const thirdLabels = ["Trước tuyển dụng", "Sau tuyển dụng"]
    const selectedLabels = ["Trước tuyển dụng", "Cần tuyển", "Thực tế", "Sau tuyển dụng"]
    useEffect(() => {
        if (select) {
            const index = positionArray.find(item => item.Thuoctinh == select).id
            const ticket = dataTicket.find(item => item.Vitri == index)
            const beforeData = ticket?.SLHT
            const needData = ticket?.SLCT
            const inputData = dataCandidate.filter(item => item.idTicket == ticket.key).length
            const outputData = beforeData + approveCandidate.filter(item => item == ticket.key).length
            setSelectedData([beforeData, needData, inputData, outputData])
        }
    }, [select])
    return (
        <Grid container spacing={2} style={{ justifyContent: "center" }}>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom component="div">Báo cáo định biên</Typography>
            </Grid>
            <Grid item container xs={12}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom component="div">Trước tuyển dụng</Typography>
                    <Main data={firstData} labels={positionLabels} handleClick={setSelect} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom component="div">Sau tuyển dụng</Typography>
                    <Main data={secondData} labels={positionLabels} handleClick={setSelect} />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Typography variant="h6" gutterBottom component="div">&nbsp;</Typography>
                    <Sub data={thirdData} labels={thirdLabels} />
                </Grid>
            </Grid>
            <Grid item xs={8} style={{ marginTop: "15px" }}>
                {select && <Sub data={selectedData} labels={selectedLabels} />}
            </Grid>
            <Grid item xs={12}>
                <Table />
            </Grid>
        </Grid>
    )
}

export default Report1
