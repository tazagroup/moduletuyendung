import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Label } from 'recharts';

const Main = () => {
    const data = [
        {
            name: 'IT', hv: 5, tv: 3, ct: 0, nv: 1
        },
        {
            name: 'Telesale', hv: 20, tv: 8, ct: 5, nv: 2,
        },
        {
            name: 'Marketing', hv: 10, tv: 4, ct: 2, nv: 0,
        },

    ];
    const renderCustomizedLabel = (props) => {
        const { content, value, index, ...rest } = props;
        const total = Object.values(data[index]).filter(item => !isNaN(item)).reduce((partial_sum, a) => partial_sum + a, 0)
        const result = Math.round((value / total) * 100)
        return value != 0 ? <Label {...rest} value={`${result}%`} fontSize="10" fill="#000" fontWeight="Bold" /> : null
    };
    return (
        <BarChart
            width={800}
            height={300}
            data={data}
            margin={{
                top: 20, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={false} />
            <Legend />
            <Bar name="Học việc" dataKey="hv" stackId="a" fill="#4285f4">
                <LabelList
                    dataKey="hv"
                    position="inside"
                    content={renderCustomizedLabel}
                />
            </Bar>
            <Bar name="Thử việc" dataKey="tv" stackId="a" fill="#db4437"  >
                <LabelList
                    dataKey="tv"
                    position="inside"
                    content={renderCustomizedLabel}
                />
            </Bar>
            <Bar name="Chính thức" dataKey="ct" stackId="a" fill="#f4b400" >
                <LabelList
                    dataKey="ct"
                    position="inside"
                    content={renderCustomizedLabel}
                />
            </Bar>
            <Bar name="Nghỉ việc" dataKey="nv" stackId="a" fill="#8f8f8f" >
                <LabelList
                    dataKey="nv"
                    position="inside"
                    content={renderCustomizedLabel}
                />
            </Bar>
        </BarChart>
    )
}

export default Main
