import React from 'react'
import { Bar } from "react-chartjs-2";

const Sub = ({ labels, data, total }) => {
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
                    "#6ba547",
                    "#9cf168",
                    "#e48f1b",
                    "#fbc543",
                    "#b77ea3",
                    "#ffc9ed",
                    "#6ba547",
                ],
                data: data,
            },
        ],
    };
    return (
        <Bar
            data={chartdata}
            options={{
                responsive: true,
                legend: { display: false, position: "right" },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItem, data) {
                            return data['labels'][tooltipItem[0]['index']];
                        },
                        label: function (tooltipItem, data) {
                            var dataset = data['datasets'];
                            const value = flag[tooltipItem['index']]
                            var percent = Math.round((value / total) * 100)
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
                scales: {
                    yAxes: [{
                        gridLines: { display: false },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Hồ sơ ứng viên',
                        },
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: total,
                            beginAtZero: true,   // minimum value will be 0.
                            callback: function (value) { if (value % 1 === 0) { return value; } }
                        }
                    }]
                },
            }}
        />
    )
}

export default Sub
