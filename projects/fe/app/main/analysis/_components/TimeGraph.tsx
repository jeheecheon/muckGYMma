"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"));

interface WeightChartProps {
    className?: string;
}

const TimeChart: React.FC<WeightChartProps> = (props) => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ReactApexChart
                    className={`w-full ${props.className}`}
                    options={{
                        chart: {
                            height: 350,
                            type: "line",
                            dropShadow: {
                                enabled: true,
                                color: "#000",
                                top: 18,
                                left: 7,
                                blur: 10,
                                opacity: 0.2,
                            },
                            toolbar: {
                                show: false,
                            },
                        },
                        colors: ["#77B6EA", "#545454"],
                        dataLabels: {
                            enabled: true,
                        },
                        stroke: {
                            curve: "smooth",
                        },
                        title: {
                            text: "시간",
                            align: "left",
                        },
                        grid: {
                            borderColor: "#e7e7e7",
                            row: {
                                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                                opacity: 0.5,
                            },
                        },
                        markers: {
                            size: 1,
                        },
                        xaxis: {
                            categories: [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                            ],
                            title: {
                                text: "Month",
                            },
                        },
                        yaxis: {
                            title: {
                                text: "Mins",
                            },
                            min: 60,
                            max: 70,
                        },
                        legend: {
                            position: "top",
                            horizontalAlign: "right",
                            floating: true,
                            offsetY: -25,
                            offsetX: -5,
                        },
                    }}
                    series={[
                        {
                            name: "High - 2013",
                            data: [63, 61, 62, 65, 66, 66, 67],
                        },
                    ]}
                    type="line"
                    width="100%"
                    height={350}
                />
            </Suspense>
        </>
    );
};

export default TimeChart;
