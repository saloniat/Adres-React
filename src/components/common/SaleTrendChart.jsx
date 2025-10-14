import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    BarChart,
    Bar,
    LabelList,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { fetchQuantaAPIData } from "../../redux/action/buyerAction";

const formattedValue = (value) => {
    return value >= 1_000_000
        ? `${value / 1_000_000}M`
        : value >= 1_000
          ? `${value / 1_000}K`
          : value;
};

export const SaleTrendChart = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    useEffect(() => {
        try {
            dispatch(fetchQuantaAPIData("sale-trend")).then((response) => {
                // console.log("Sale Trend Response:", response);
                const chartData = response
                    ?.sort(
                        (a, b) =>
                            new Date(a?.endOfPeriod).getTime() -
                            new Date(b?.endOfPeriod).getTime()
                    )
                    ?.map((item) => ({
                        quarter: getQuarterLabel(item?.endOfPeriod),
                        low: item?.count,
                        high: item?.count,
                        total: item?.count + item?.count,
                        topValue: formattedValue(item?.count + item?.count),
                    }));
                setData(chartData);
            });
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
            <BarChart
                data={data}
                margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                barGap={8}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="quarter"
                    axisLine={false}
                    tickLine={false}
                    tick={{ dy: 20 }}
                />
                <YAxis
                    tickFormatter={(value) => {
                        if (value >= 1_000_000) return `${value / 1_000_000}M`;
                        if (value >= 1_000) return `${value / 1_000}K`;
                        return value;
                    }}
                    tick={{ dy: 20 }}
                    axisLine={false}
                    tickLine={false}
                />

                <Bar
                    barSize={100}
                    dataKey="low"
                    stackId="a"
                    fill="#3D3DED"
                    name="Low"
                />
                <Bar
                    barSize={100}
                    dataKey="high"
                    stackId="a"
                    fill="#ADD8FF"
                    name="High"
                    radius={[10, 10, 0, 0]}
                >
                    <LabelList dataKey="topValue" position="top" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
