import React, { useRef } from 'react'
import { Doughnut } from "react-chartjs-2";
import "chartjs-plugin-doughnutlabel";
const MaxValue = ({ labels, data }) => {
    const flag = [...data]
    const chartRef = useRef(null)
    let customLabels = labels.map((label, index) => `${label}`)
    const chartdata = {
        labels: customLabels,
        datasets: [
            {
                backgroundColor: [
                    "#ea4335",
                ],
                data: data,
            },
        ],
    };

    return (
        <Doughnut
            ref={chartRef}
            data={chartdata}
            options={{
                responsive: true,
                legend: {
                    display: false,
                    position: "right"
                },
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
                plugins: {
                    datalabels: {
                        display: true,
                        color: "#fff",
                        font: {
                            size: 14,
                            weight: "bold"
                        },
                        formatter: (value) => {
                            if (value == 0) return ""
                            return value
                        }
                    },
                },
                // onClick: function (evt, element) {
                //     if (element.length > 0) {
                //         //index of element
                //         var index = element[0]._index;

                //     }
                // },
            }}
        />
    )
}

export default MaxValue
