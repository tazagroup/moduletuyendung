import React from 'react'
import { Doughnut } from "react-chartjs-2";
import "chartjs-plugin-doughnutlabel";
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
        <Doughnut
            data={chartdata}
            options={{
                responsive: true,
                legend: { display: true, position: "right" },
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
                        color: "#000",
                        font: {
                            size: 14,
                            weight: "bold"
                        }
                    },
                    doughnutlabel: {
                        labels: [{
                            text: `Tổng : ${total}`,
                            color: "#000",
                            font: {
                                size: 20,
                                weight: 'bold'
                            }
                        }]
                    }
                },
                onClick: function (evt, element) {
                    if (element.length > 0) {
                        //index of element
                        var index = element[0]._index;
                        handleClick(labels[index])
                    }
                },
            }}
        />
    )
}

export default Main
