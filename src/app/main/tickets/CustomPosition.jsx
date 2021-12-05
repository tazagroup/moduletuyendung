import React from 'react'
import { useSelector } from 'react-redux'
const CustomPosition = ({ data }) => {
    const position = useSelector(state => state.fuse.tickets.position)
    const flagArray = position.map(item => item)
    return (
        <div>
            {flagArray.find(item => item.id == data.Vitri).Thuoctinh}
        </div>
    )
}

export default CustomPosition
