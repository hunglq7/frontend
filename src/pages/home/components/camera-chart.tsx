import type { EChartsOption } from "echarts";
import { useCameraStore } from "#src/store/camera/cameraStore";
import { Alert, Card, Spin } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect, useMemo } from "react";

export default function CameraChart() {
	const loading = useCameraStore(state => state.loading);
	const error = useCameraStore(state => state.error);
	const activeCount = useCameraStore(state => state.activeCount);
	const disconnectedCount = useCameraStore(state => state.disconnectedCount);
	const fetchCameraSummary = useCameraStore(state => state.fetchCameraSummary);

	useEffect(() => {
		fetchCameraSummary();
	}, [fetchCameraSummary]);

	const option: EChartsOption = useMemo(() => ({
		title: {
			text: "Trạng thái Camera",
			subtext: "Tổng số camera kết nối và mất kết nối",
		},
		xAxis: {
			type: "category",
			data: ["Đang kết nối", "Mất kết nối"],
		},
		yAxis: {
			type: "value",
		},
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			formatter: "{b}: {c} camera",
		},
		grid: {
			left: "8%",
			right: "6%",
			bottom: "12%",
			top: "18%",
			containLabel: true,
		},
		series: [
			{
				name: "Số lượng Camera",
				type: "bar",
				barWidth: "28%",
				barCategoryGap: "12%",
				itemStyle: {
					borderRadius: [4, 4, 0, 0],
				},
				data: [
					{
						value: activeCount,
						itemStyle: { color: "#52c41a" },
						name: `Đang kết nối (${activeCount})`,

					},
					{
						value: disconnectedCount,
						itemStyle: { color: "#f5222d" },
						name: `Mất kết nối (${disconnectedCount})`,

					},
				],
				label: {
					show: true,
					position: "top",
					formatter: "{c}",
				},
			},
		],
	}), [activeCount, disconnectedCount]);

	if (loading) {
		return (
			<Card title="Trạng thái Camera" style={{ width: "100%" }}>
				<div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
					<Spin />
				</div>
			</Card>
		);
	}

	if (error) {
		return (
			<Card title="Camera" style={{ width: "100%" }}>
				<Alert message={error} type="error" />
			</Card>
		);
	}

	return (
		<Card
			title="Camera"
			style={{ width: "100%" }}
			extra={(
				<span className="font-medium text-lg">
					Tổng số camera:
					{" "}
					<span className="text-red-500">
						{activeCount + disconnectedCount}
					</span>
				</span>
			)}
		>
			<ReactECharts
				option={option}
				opts={{ height: "auto", width: "auto" }}
				style={{ height: "400px" }}
			/>
		</Card>
	);
}
