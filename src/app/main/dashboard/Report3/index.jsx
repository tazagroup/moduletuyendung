import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography, IconButton } from '@mui/material'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { AiOutlineFileExcel } from 'react-icons/ai'
import { styled } from '@mui/material/styles';
import Main from './Main'
import Sub from './Sub'
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const convertIdToName = (arr, id) => {
    return arr.find(opt => opt.id == id)?.Thuoctinh
}
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
const Report3 = () => {
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])
    const [subLabels, setSubLabels] = useState([])
    const [subData, setSubData] = useState([])
    const [select, setSelect] = useState(null)
    const source = useSelector(state => state.fuse.tickets.source)
    const position = useSelector(state => state.fuse.tickets.position)
    const mainDataTicket = useSelector(state => state.fuse.tickets.dashboardTicket)
    const mainDataCandidate = useSelector(state => state.fuse.candidates.dashboardCandidate)
    //DATA
    const renderData = mainDataCandidate.map((item, index) => {
        return {
            id: index,
            idSource: JSON.parse(item.Profile).Nguon,
            Vitri: convertIdToName(position, mainDataTicket.find(opt => opt.key == item.idTicket)?.Vitri),
        }
    })
    const convertExcelObject = (position) => {
        let result = {}
        const idPosition = source.find(opt => opt.Thuoctinh == position).id
        const arrayToPosition = renderData.filter(opt => opt.idSource == idPosition)
        arrayToPosition.forEach(item => {
            result[item['Vitri']] = (result[item['Vitri']] || 0) + 1
        })
        return result
    }
    const fillMissingProperties = (array) => {
        const result = array.map(x => (
            array.map(x => Object.keys(x))
                .reduce((a, b) =>
                    (b.forEach(z => a.includes(z) || a.push(z)), a)
                )
                .forEach(
                    y => (x[y] = x.hasOwnProperty(y) ? x[y] : 0)
                ), x)
        );
        return result
    }
    const dataExcel = fillMissingProperties(labels.map((item, index) => ({
        ...convertExcelObject(item),
        Vitri: item,
        Tong: data[index]
    })))
    let columnsExcel = []
    if (dataExcel.length !== 0) {
        columnsExcel = Object.keys(dataExcel[0])
    }
    columnsExcel.splice(columnsExcel.indexOf('Vitri'), 1)
    columnsExcel.splice(columnsExcel.indexOf('Tong'), 1)
    useEffect(() => {
        const sourceData = renderData.map(item => source.find(opt => opt.id == item.idSource)?.Thuoctinh)
        const counts = {};
        sourceData.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });
        setLabels(Object.keys(counts))
        setData(Object.values(counts))
    }, [])
    useEffect(() => {
        if (select) {
            const index = source.find(item => item.Thuoctinh == select).id
            const sourceToPosition = renderData.filter(item => item.idSource == index)
            const counts = {};
            sourceToPosition.map(item => item.Vitri).forEach(x => counts[x] = (counts[x] || 0) + 1)
            setSubLabels(Object.keys(counts))
            setSubData(Object.values(counts))
        }
    }, [select])
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{ display: "flex" }}>
                    <Typography variant="h3" component="div">Báo cáo nguồn</Typography>
                    <ExcelFile element={(
                        <CustomTooltip title='Xuất Excel'>
                            <IconButton>
                                <AiOutlineFileExcel style={{ color: "green" }} />
                            </IconButton>
                        </CustomTooltip>
                    )}>
                        <ExcelSheet data={dataExcel} name="Nguồn">
                            <ExcelColumn label="Nguồn" value="Vitri" />
                            {columnsExcel.map((item, index) => (
                                <ExcelColumn key={index} label={item} value={item} />
                            ))}
                            <ExcelColumn label="Tổng" value="Tong" />
                        </ExcelSheet>
                    </ExcelFile>
                </div>
            </Grid>
            <Grid item xs={12} md={6}>
                <Main data={data} labels={labels} handleClick={setSelect} />
            </Grid>
            <Grid item xs={12} md={6}>
                {select && <Sub data={subData} labels={subLabels} />}
            </Grid>
        </Grid>
    )
}

export default Report3