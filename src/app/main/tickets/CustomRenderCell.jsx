import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ModalExpand from './ModalExpand'
const convertCurrency = (value) => {
    return value && Number(value.split(",").join(''))
}
const convertRenderCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}
const convertIdToSource = (arr, id) => {
    return arr.find(opt => opt.id == id).name
}
const CustomRenderCell = ({ data }) => {
    const sources = useSelector(state => state.fuse.tickets.source)
    const step = JSON.parse(data['Pheduyet'])[3]
    const [isExpand, setIsExpand] = useState(false)
    const main = step?.CPTD
    const sourceBody = main && main.map(item => item.Nguon) || []
    const expectedCurrencyBody = main && main.map(item => convertCurrency(item?.Chiphi)).reduce((a, b) => a + b, 0) || []
    const realCurrencyBody = main && main.map(item => convertCurrency(item?.CPTT)).reduce((a, b) => a + b, 0) || []
    const typeBody = main && main.map(item => item.Hinhthuc) || []
    return (
        <>
            <div className="custom__table">
                <div className="table__item" style={{ width: "65px", wordWrap: "break-word" }}>
                    <div className="item__title">
                        <p>Nguồn</p>
                    </div>
                    <div className="item__content">
                        {sourceBody.length >= 2 ?
                            <IconButton onClick={() => { setIsExpand(true) }}>
                                <MoreHorizIcon />
                            </IconButton> : sourceBody.map((item, index) => (
                                <p key={index}>{convertIdToSource(sources, item)}</p>
                            ))}
                    </div>
                </div>
                <div className="table__item">
                    <div className="item__title">
                        <p>Chi phí dự kiến</p>
                    </div>
                    <div className="item__content">
                        <p>{convertRenderCurrency(expectedCurrencyBody)}</p>
                    </div>
                </div>
                <div className="table__item">
                    <div className="item__title">
                        <p>Chi phí thực tế</p>
                    </div>
                    <div className="item__content">
                        {Number(realCurrencyBody) !== 0 ? convertRenderCurrency(realCurrencyBody) : <ClearIcon />}
                    </div>
                </div>
                <div className="table__item">
                    <div className="item__title">
                        <p>Chi phí còn lại</p>
                    </div>
                    <div className="item__content">
                        {Number(realCurrencyBody) !== 0 ? convertRenderCurrency(expectedCurrencyBody - realCurrencyBody) : <ClearIcon />}
                    </div>
                </div>
                <div className="table__item" style={{ width: "130px" }}>
                    <div className="item__title">
                        <p>Hình thức</p>
                    </div>
                    <div className="item__content">
                        {typeBody.length >= 2 ?
                            <IconButton onClick={() => { setIsExpand(true) }}>
                                <MoreHorizIcon />
                            </IconButton> : typeBody.map((item, index) => (
                                <p key={index}>{item}</p>
                            ))}
                    </div>
                </div>
            </div>
            {isExpand &&
                <ModalExpand
                    open={isExpand}
                    data={main}
                    handleClose={() => { setIsExpand(false) }}
                />}
        </>
    )
}

export default CustomRenderCell
