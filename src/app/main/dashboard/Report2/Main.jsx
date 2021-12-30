import React from 'react'
import { Doughnut } from "react-chartjs-2";

const Main = ({ labels, data, handleClick }) => {
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
    const plugins = [{
        beforeDraw: function (chart) {
            var width = chart.width - 145,
                height = chart.height+10,
                ctx = chart.ctx;
            ctx.restore();
            var fontSize = (height / 140).toFixed(2);
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "middle";
            var text = `${total}`,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    }]
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
                onClick: function (evt, element) {
                    if (element.length > 0) {
                        //index of element
                        var index = element[0]._index;
                        handleClick(labels[index])
                    }
                },
            }}
            plugins={plugins}
        />
    )
}

export default Main
