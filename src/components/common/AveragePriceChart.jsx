import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { fetchQuantaAPIData } from "../../redux/action/buyerAction";

const formatYAxis = (value) => {
    if (value >= 1_000_000) return `${value / 1_000_000}M`;
    if (value >= 1_000) return `${value / 1_000}K`;
    return value;
};

export function AveragePriceChart() {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    useEffect(() => {
        try {
            dispatch(fetchQuantaAPIData("average-sale-price")).then(
                (response) => {
                    // console.log("Average Price Response:", response);
                    const chartData = response
                        ?.sort(
                            (a, b) =>
                                new Date(a?.endOfPeriod).getTime() -
                                new Date(b?.endOfPeriod).getTime()
                        )
                        ?.map((item) => ({
                            name: getQuarterLabel(item?.endOfPeriod),
                            top: item?.avgPrice,
                        }));
                    setData(chartData);
                }
            );
        } catch (error) {
            console.error("One of the requests failed:", error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getQuarterLabel(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth();
        const quarter = Math.floor(month / 3) + 1;
        return `${year} Q${quarter}`;
    }

    return (
        <ResponsiveContainer width="100%" height={312}>
            <LineChart
                data={data}
                margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
            >
                <XAxis
                    dataKey="name"
                    tick={{ dy: 20 }}
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 30, right: 30 }}
                />
                <YAxis
                    tickFormatter={formatYAxis}
                    tick={{ dy: 20 }}
                    axisLine={false}
                    tickLine={false}
                />
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#ddd"
                />

                <Line
                    type="linear"
                    dataKey="top"
                    color="#000000"
                    dot={({ cx, cy }) => (
                        <g>
                            <circle
                                cx={cx}
                                cy={cy - 8}
                                r={5}
                                fill="#007bff"
                                stroke="#007bff"
                            />
                            <rect
                                x={cx - 4}
                                y={cy + 3}
                                width={8}
                                height={8}
                                fill="#87cefa"
                                stroke="#87cefa"
                            />
                        </g>
                    )}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
