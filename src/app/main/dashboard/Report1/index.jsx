import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography, Tabs, Tab, IconButton } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { AiOutlineFileExcel } from 'react-icons/ai'
import { styled } from '@mui/material/styles';
import Main from './Main'
import Sub from './Sub'
import MaxValue from './MaxValue'
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;


const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: 12,
        border: '1px solid #dadde9',
    },
}));
const listItemStyle = {
    color: "#333",
    listStyle: "none",
    textAlign: "left",
    display: "flex",
    flex: "auto",
    margin: "8px"
};
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
    const [value, setValue] = useState("1");
    //REFS
    const [legend, setLegend] = useState(null)
    const [beforeDataRef, setBeforeDataRef] = useState(null)
    const [afterDataRef, setAfterDataRef] = useState(null)
    //DATASETS
    const [dataSet, setDataSet] = useState(null)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const selectedLabels = ["Trước tuyển dụng", "Cần tuyển", "Thực tế", "Sau tuyển dụng"]
    //EXCEL
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
    useEffect(() => {
        if (beforeDataRef || afterDataRef) {
            const before = beforeDataRef.current.props.data
            const after = afterDataRef.current.props.data
            const data = {
                labels: beforeDataRef.current.props.data.labels,
                colors: before.datasets[0].backgroundColor,
                beforeData: before.datasets[0].data,
                afterData: after.datasets[0].data
            }
            const dataSet = [{
                columns: [
                    { title: "Vị trí", width: { wpx: 180 } },
                    { title: "Trước tuyển dụng" },
                    { title: "Sau tuyển dụng" },
                ],
                data: data.beforeData.map((item, index) => {
                    return [
                        { value: data.labels[index] },
                        { value: data.beforeData[index] },
                        { value: data.afterData[index] },
                    ]
                }).sort((a, b) => {
                    return (b[2].value - b[1].value) - (a[2].value - a[1].value)
                })
            }]
            dataSet[0].data.unshift([{ value: "#" }, { value: "Tổng : " + countSum(data.beforeData) }, { value: "Tổng : " + countSum(data.afterData) }])
            let flag = dataSet[0].data[1]
            flag = flag.map(item => {
                return {
                    ...item,
                    style: { fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } }, font: { color: { rgb: "FFFFFFFF" } } }
                }
            })
            dataSet[0].data[1] = flag
            console.log(dataSet)
            setDataSet(dataSet)
            setLegend(data)
        }
    }, [beforeDataRef, afterDataRef])
    const deviantResult = secondData.map((item, index) => ({
        vitri: positionLabels[index],
        value: item - firstData[index]
    })).sort((a, b) => b.value - a.value)
    const OverviewDataSet = [{
        columns: [
            { title: "Trước tuyển dụng" },
            { title: "Cần tuyển" },
            { title: "Thực tế" },
            { title: "Sau tuyển dụng" },
        ],
        data: [thirdData.map(item => ({ value: item }))]
    }]
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div style={{ display: "flex" }}>
                        <Typography variant="h3" component="div">Báo cáo định biên</Typography>
                        <ExcelFile element={(
                            <CustomTooltip title='Xuất Excel'>
                                <IconButton>
                                    <AiOutlineFileExcel style={{ color: "green" }} />
                                </IconButton>
                            </CustomTooltip>
                        )}>
                            <ExcelSheet name="Vị trí tuyển dụng" dataSet={dataSet} />
                            <ExcelSheet name="Tổng quát" dataSet={OverviewDataSet} />
                        </ExcelFile>
                    </div>
                </Grid>
            </Grid >
            <Grid container style={{ justifyContent: "center", padding: 0 }} spacing={2}>
                {/* Trước tuyển dụng  */}
                <Grid item container xs={12} md={12}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom component="div">Trước tuyển dụng</Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Main data={firstData}
                            labels={positionLabels}
                            handleClick={setSelect}
                            handleSetRef={(e) => { setBeforeDataRef(e) }}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <ul style={{ display: "flex", flexWrap: "wrap" }}>
                            {legend && legend.labels.map((item, index) => (
                                <li key={index} style={listItemStyle}>
                                    <div
                                        style={{
                                            margin: "0 4px",
                                            width: "20px",
                                            height: "20px",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            backgroundColor: legend.colors[index] ? legend.colors[index] : "#dddddf"
                                        }}
                                    >
                                        {legend.beforeData[index]}
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                </Grid>
                {/* Sau tuyển dụng */}
                <Grid item container xs={12} md={12}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom component="div">Sau tuyển dụng</Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Main data={secondData} labels={positionLabels} handleClick={setSelect} handleSetRef={(e) => { setAfterDataRef(e) }} />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <ul style={{ display: "flex", flexWrap: "wrap" }}>
                            {legend && legend.labels.map((item, index) => (
                                <li key={index} style={listItemStyle}>
                                    <div
                                        style={{
                                            margin: "0 4px",
                                            width: "20px",
                                            height: "20px",
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            backgroundColor: legend.colors[index] ? legend.colors[index] : "#dddddf"
                                        }}
                                    >
                                        {legend.afterData[index]}
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Grid>
                </Grid>
                {/* Biến động */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="div">
                        Biến động nhiều nhất : {deviantResult.map(item => item.vitri)[0]}
                    </Typography>
                    <MaxValue labels={deviantResult.map(item => item.vitri)} data={deviantResult.map(item => item.value)} />
                </Grid>
                {/* Tổng quát  */}
                <Grid item xs={12} md={6}>
                    <TabContext value={value}>
                        <TabList onChange={handleChange} centered>
                            <Tab label="Tổng quát" value={"1"} />
                            <Tab label="Vị trí" value={"2"} />
                        </TabList>
                        <TabPanel value={"1"}>
                            <Typography variant="h4" gutterBottom component="div">Tổng quát : sau tuyển dụng</Typography>
                            <Sub data={thirdData} labels={selectedLabels} />
                        </TabPanel>
                        <TabPanel value={"2"}>
                            <Typography variant="h4" gutterBottom component="div">Vị trí : {select}</Typography>
                            {select && <Sub data={selectedData} labels={selectedLabels} />}
                        </TabPanel>
                    </TabContext>
                </Grid>
            </Grid>
        </>
    )
}

export default Report1
