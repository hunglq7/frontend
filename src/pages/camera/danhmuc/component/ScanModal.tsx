import type { DanhmucCameraItemType } from "#src/api/camera/danhmuc/types";
import { StopOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Modal, Progress, Row, Spin, Statistic } from "antd";
import { useTranslation } from "react-i18next";

interface ScanModalProps {
	visible: boolean
	scanning: boolean
	progress: number
	onlineCount: number
	offlineCount: number
	currentCamera: DanhmucCameraItemType | null
	totalCameras: number
	onCancel: () => void
}

export const ScanModal: React.FC<ScanModalProps> = ({
	visible,
	scanning,
	onlineCount,
	offlineCount,
	currentCamera,
	totalCameras,
	onCancel,
}) => {
	const { t } = useTranslation();

	const processedCount = onlineCount + offlineCount;
	const percentageProgress = totalCameras > 0 ? Math.round((processedCount / totalCameras) * 100) : 0;

	return (
		<Modal
			title={t("camera.scanAll") || "Scan Camera Status"}
			open={visible}
			onCancel={onCancel}
			footer={[
				<Button
					key="cancel"
					danger={scanning}
					icon={<StopOutlined />}
					onClick={onCancel}
				>
					{scanning ? (t("camera.cancelScan") || "Stop Scan") : (t("common.close") || "Close")}
				</Button>,
			]}
			width={700}
			centered
		>
			<Spin spinning={scanning} tip={t("camera.scanning") || "Scanning..."}>
				<div style={{ padding: "20px 0" }}>
					{/* Progress Section */}
					<Card style={{ marginBottom: 24 }}>
						<div style={{ marginBottom: 16 }}>
							<div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
								{t("camera.scanProgress") || "Scan Progress"}
							</div>
							<Progress
								percent={percentageProgress}
								status={scanning ? "active" : percentageProgress === 100 ? "success" : "normal"}
								strokeColor={scanning ? "#1890ff" : percentageProgress === 100 ? "#52c41a" : "#d9d9d9"}
								showInfo
							/>
						</div>

						<div style={{ fontSize: 12, color: "#666" }}>
							{processedCount}
							/
							{totalCameras}
							{" "}
							{t("camera.camerasScanned") || "cameras scanned"}
						</div>
					</Card>

					{/* Statistics Section */}
					<Row gutter={16} style={{ marginBottom: 24 }}>
						<Col xs={24} sm={8}>
							<Card>
								<Statistic
									title={t("camera.onlineCameras") || "Online"}
									value={onlineCount}
									valueStyle={{ color: "#52c41a", fontSize: 24 }}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={8}>
							<Card>
								<Statistic
									title={t("camera.offlineCameras") || "Offline"}
									value={offlineCount}
									valueStyle={{ color: "#ff4d4f", fontSize: 24 }}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={8}>
							<Card>
								<Statistic
									title={t("camera.percentProgress") || "Progress %"}
									value={percentageProgress}
									suffix="%"
									valueStyle={{ fontSize: 24 }}
								/>
							</Card>
						</Col>
					</Row>

					{/* Current Camera Section */}
					<Card
						title={t("camera.currentScanning") || "Currently Scanning"}
						style={{ backgroundColor: "#fafafa" }}
					>
						{currentCamera
							? (
								<div>
									<div style={{ marginBottom: 12 }}>
										<span style={{ fontWeight: 500 }}>
											{t("camera.tenThietBi") || "Device Name"}
											:
										</span>
										{" "}
										<span>{currentCamera.name}</span>
									</div>
									<div style={{ marginBottom: 12 }}>
										<span style={{ fontWeight: 500 }}>
											{t("camera.ipAddress") || "IP Address"}
											:
										</span>
										{" "}
										<span>{currentCamera.ip_address}</span>
									</div>
									<div>
										<span style={{ fontWeight: 500 }}>
											{t("camera.location") || "Location"}
											:
										</span>
										{" "}
										<span>{currentCamera.location || "N/A"}</span>
									</div>
								</div>
							)
							: (
								<Empty
									description={t("camera.noCamera") || "No camera"}
									style={{ margin: "20px 0" }}
								/>
							)}
					</Card>
				</div>
			</Spin>
		</Modal>
	);
};
