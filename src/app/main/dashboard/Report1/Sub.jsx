import React from 'react'
import { Bar } from "react-chartjs-2";

const Main = ({ labels, data, total }) => {
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
                            const value = flag[tooltipItem['index']]
                            return value;
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
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: total,
                            beginAtZero: true,   // minimum value will be 0.
                            callback: function (value) { if (value % 1 === 0) { return value; } }
                        }
                    }]
                },
                plugins: {
                    datalabels: {
                        display: true,
                        color: "#fff",
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    },
                },
            }}
        />
    )
}

export default Main
