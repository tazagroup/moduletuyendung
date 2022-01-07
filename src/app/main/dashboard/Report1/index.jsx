import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography } from '@mui/material'
import Main from './Main'
import Sub from './Sub'
import MaxValue from './MaxValue'
const convertIdToName = (arr, id) => {
    return arr.find(opt => opt.id == id).Thuoctinh
}
const countSum = (array) => {
    return array.reduce((sum, a) => sum + a, 0);
}
const sumArrays = (...arrays) => {
    const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
    const result = Array.from({ length: n });
    return result.map((_, i) => arrays.map(xs => xs[i] || 0).reduce((sum, x) => sum + x, 0));
}

const Report1 = () => {
    const dataTicket = useSelector(state => state.fuse.tickets.dashboardTicket)
    const dataCandidate = useSelector(state => state.fuse.candidates.dashboardCandidate)
    const positionArray = useSelector(state => state.fuse.tickets.position)
    const approveCandidate = dataCandidate.map(item => item.idTicket)
    const main = dataTicket.reduce(function (accumulator, cur) {
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
    const candidateToPosition = main.map(item => dataCandidate.filter(item2 => item2.idTicket == item.key).length)
    const positionLabels = main.map(item => convertIdToName(positionArray, item.Vitri))
    const firstData = [...main.map(item => item.SLHT)]
    const secondData = [...sumArrays(main.map(item => item.SLHT), candidateToPosition)]
    const thirdData = [countSum(firstData), countSum(dataTicket.map(item => item.SLCT)), dataCandidate.length, countSum(secondData)]
    //SELECT CELL
    const [selectedData, setSelectedData] = useState([])
    const [select, setSelect] = useState(null)
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
    const deviantResult = secondData.map((item, index) => ({
        vitri: positionLabels[index],
        value: item / countSum(secondData)
    })).sort((a, b) => b.value - a.value)
    console.log(deviantResult)
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom component="div">Báo cáo định biên</Typography>
            </Grid>
            <Grid item container xs={12} style={{ justifyContent: "center" }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom component="div">Trước tuyển dụng</Typography>
                    <Main data={firstData} labels={positionLabels} handleClick={setSelect} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom component="div">Sau tuyển dụng</Typography>
                    <Main data={secondData} labels={positionLabels} handleClick={setSelect} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom component="div">Vị trí : {select}</Typography>
                    {select && <Sub data={selectedData} labels={selectedLabels} />}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom component="div">Tổng quát : sau tuyển dụng</Typography>
                    <Sub data={thirdData} labels={selectedLabels} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom component="div">
                        Biến động nhiều nhất : {deviantResult.map(item => item.vitri)[0]}
                    </Typography>
                    <MaxValue labels={deviantResult.map(item => item.vitri)} data={deviantResult.map(item => item.value)} />
                </Grid>
            </Grid>

        </Grid>
    )
}

export default Report1
