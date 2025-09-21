import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getName } from 'country-list';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement
} from "chart.js";
import { ClipLoader } from "react-spinners";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement
);

export default function EUCountriesPerProject() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/stats/projects_by_country")
            .then((res) => res.json())
            .then((data) => {
                setChartData({
                    labels: data.map((item) => getName(item.country)?.slice(0, 10) || "Unknown"),
                    datasets: [
                        {
                            data: data.map((item) => item.project_count),
                            backgroundColor: [
                                "#6DAEDB", // Medium blue
                                "#77DD77", // Medium green
                                "#FFB347", // Peach-orange
                                "#B19CD9", // Lavender
                                "#FF6961", // Coral
                                "#AEC6CF", // Light blue
                                "#FDFD96", // Light yellow
                                "#84B082", // Sage green
                                "#F49AC2", // Pink
                                "#CB99C9", // Mauve
                            ],
                            borderColor: "rgba(255, 255, 255, 0.8)",
                            borderWidth: 1,
                            borderRadius: 6,
                            hoverBackgroundColor: [
                                "#5A9BC8", // Darker blue
                                "#66CC66", // Darker green
                                "#F0A040", // Darker peach-orange
                                "#9E8AC9", // Darker lavender
                                "#F05959", // Darker coral
                                "#9BB5C4", // Darker light blue
                                "#F5F586", // Darker light yellow
                                "#739E71", // Darker sage green
                                "#E48AB0", // Darker pink
                                "#BA88B8", // Darker mauve
                            ],
                        },
                    ],
                })
            })
    }, [])

    if (!chartData) return (
        <div className="w-full max-w-lg ">
            <ClipLoader className="w-1/2 mx-auto" />
        </div>
    );

    return (
        <div className="bg-white p-6 w-full max-w-6xl mx-auto">
            {/* <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
                EU Contribution per Country
            </h2> */}
            <div className="h-96">
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'x',
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.raw.toLocaleString()}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: "rgba(0, 0, 0, 0.05)",
                                },
                                ticks: {
                                    callback: function (value) {
                                        return value.toLocaleString();
                                    }
                                },
                                title: {
                                    display: true,
                                    text: "Number of Projects",
                                    font: {
                                        weight: "bold",
                                        size: 12
                                    }
                                }
                            },
                            x: {
                                grid: {
                                    display: false,
                                },
                                ticks: {
                                    maxRotation: 45,
                                    minRotation: 45
                                },
                                title: {
                                    display: true,
                                    text: "Data showing the number of projects for each EU countries",
                                    font: {
                                        weight: "bold",
                                        size: 12
                                    }
                                }
                            },
                        },
                        elements: {
                            bar: {
                                // This makes the bars thicker
                                barPercentage: 0.7,
                                categoryPercentage: 0.8,
                            }
                        }
                    }}
                />
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">

            </div>
        </div>
    );
}