import React from 'react'
import { Doughnut } from "react-chartjs-2";

const Sub = ({ labels, data }) => {
    const total = data.reduce((partial_sum, a) => partial_sum + a, 0);
    const flag = [...data]
    let customLabels = labels.map((label, index) => `${label}`)
    const chartdata = {
        labels: customLabels,
        datasets: [
            {
                backgroundColor: [
                    "#4285f4",
                    "#db4437",
                    "#f4b400",
                ],
                data: data,
            },
        ],
    };
 
    return (
        <Doughnut
            data={chartdata}
            options={{
                responsive: true,
                legend: { display: true, position: "right" },
                datalabels: {
                    display: true,
                    formatter: (val, ctx) => {
                        return ctx.chart.data.labels[ctx.dataIndex];
                    },
                    color: '#fff',
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItem, data) {
                            return data['labels'][tooltipItem[0]['index']];
                        },
                        label: function (tooltipItem, data) {
                            var dataset = data['datasets'];
                            const value = flag[tooltipItem['index']]
                            const sum = dataset[0].data.reduce((partial_sum, a) => partial_sum + a, 0)
                            var percent = Math.round((value / sum) * 100)
                            const afterLabel = ' (' + percent + '%)';
                            return value + afterLabel;
                        },
                    },
                    backgroundColor: '#FFF',
                    titleFontSize: 16,
                    titleFontColor: '#0066ff',
                    bodyFontColor: '#000',
                    bodyFontSize: 14,
                    displayColors: false
                },
            }}

        />
    )
}

export default Sub
