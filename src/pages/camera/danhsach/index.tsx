import type { DanhsachCameraItemType } from "#src/api/camera/danhsach/types";
import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import {
	fetchCheckStatusDanhsachCamera,
	fetchDanhsachCamerasList,
	fetchDeleteDanhsachCameraItem,
	fetchDownloadDanhsachCameraTemplate,
	fetchImportDanhsachCamera,
} from "#src/api/camera/danhsach/index";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { useCameraStore } from "#src/store/camera/cameraStore";
import { ClearOutlined, DeleteOutlined, PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Popconfirm, Row, Select, Upload } from "antd";
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { Detail } from "./component/detail";
import { getConstantColumns } from "./constants";

export default function DanhsachCameraPage() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<DanhsachCameraItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [searchName, setSearchName] = useState("");
	const [searchIp, setSearchIp] = useState("");
	const [searchLocation, setSearchLocation] = useState("");
	const [searchStatus, setSearchStatus] = useState<boolean | null>(null);
	const [checkingStatus, setCheckingStatus] = useState(false);
	const [importing, setImporting] = useState(false);
	const actionRef = useRef<ActionType>(null);

	const handleImportExcel = async (file: File) => {
		setImporting(true);
		try {
			await fetchImportDanhsachCamera(file);
			await Promise.all([
				useCameraStore.getState().fetchTotalCameras(),
				useCameraStore.getState().fetchCameraSummary(),
			]);
			window.$message?.success(t("common.uploadSuccess") || "Import successful");
			await actionRef.current?.reload?.();
		}
		catch (error) {
			console.error("Import failed", error);
			window.$message?.error(t("common.uploadFailed") || "Import failed");
		}
		finally {
			setImporting(false);
		}
	};

	const handleDownloadTemplate = async () => {
		try {
			const blob = await fetchDownloadDanhsachCameraTemplate();
			const url = window.URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = "camera_template.xlsx";
			anchor.click();
			window.URL.revokeObjectURL(url);
			window.$message?.success(t("common.downloadSuccess") || "Template downloaded");
		}
		catch (error) {
			console.error("Template download failed", error);
			window.$message?.error(t("common.downloadFailed") || "Download failed");
		}
	};

	const handleUploadFile = (file: File) => {
		handleImportExcel(file);
		return false;
	};

	const handleCheckStatusFile = (file: File) => {
		setCheckingStatus(true);
		fetchCheckStatusDanhsachCamera(file)
			.then((result) => {
				window.$message?.success(result?.message || (t("camera.checkStatusSuccess") || "Status check completed"));
				actionRef.current?.reload?.();
			})
			.catch((error) => {
				console.error("Check status failed", error);
				window.$message?.error(t("camera.checkStatusFailed") || "Failed to check status");
			})
			.finally(() => {
				setCheckingStatus(false);
			});
		return false;
	};

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteDanhsachCameraItem(id);
		await Promise.all([
			useCameraStore.getState().fetchTotalCameras(),
			useCameraStore.getState().fetchCameraSummary(),
		]);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleDeleteMultiple = async () => {
		try {
			const deletePromises = selectedRowKeys.map(key =>
				fetchDeleteDanhsachCameraItem(key as number),
			);
			await Promise.all(deletePromises);
			await Promise.all([
				useCameraStore.getState().fetchTotalCameras(),
				useCameraStore.getState().fetchCameraSummary(),
			]);
			window.$message?.success(
				t("common.deleteSuccess") || `Xóa thành công ${selectedRowKeys.length} bản ghi`,
			);
			setSelectedRowKeys([]);
			await actionRef.current?.reload?.();
		}
		catch (error) {
			console.error("Delete multiple failed", error);
			window.$message?.error(t("common.deleteFailed") || "Failed to delete items");
		}
	};

	const filterCameras = (cameras: DanhsachCameraItemType[]): DanhsachCameraItemType[] => {
		return cameras.filter((camera) => {
			const matchName = searchName === "" || (camera.name?.toLowerCase().includes(searchName.toLowerCase()) ?? false);
			const matchIp = searchIp === "" || (camera.ip_address?.toLowerCase().includes(searchIp.toLowerCase()) ?? false);
			const matchLocation = searchLocation === "" || (camera.location?.toLowerCase().includes(searchLocation.toLowerCase()) ?? false);
			const cameraOnline = Boolean(camera.is_online);
			const matchStatus = searchStatus === null || cameraOnline === searchStatus;

			return matchName && matchIp && matchLocation && matchStatus;
		});
	};

	const handleClearFilters = () => {
		setSearchName("");
		setSearchIp("");
		setSearchLocation("");
		setSearchStatus(null);
		actionRef.current?.reload?.();
	};

	// Reload table when search filters change (with debounce)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			actionRef.current?.reload?.();
		}, 300); // 300ms debounce

		return () => clearTimeout(timeoutId);
	}, [searchName, searchIp, searchLocation, searchStatus]);

	const handleExportExcel = async () => {
		try {
			const data = await fetchDanhsachCamerasList();
			const filteredData = filterCameras(data);

			const formatDate = (dateStr: string | null) => {
				if (!dateStr) {
					return "";
				}
				const date = new Date(dateStr);
				if (Number.isNaN(date.getTime())) {
					return dateStr;
				}
				const day = String(date.getDate()).padStart(2, "0");
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const year = date.getFullYear();
				return `${day}/${month}/${year}`;
			};

			const exportData = filteredData.map((item, index) => ({
				"STT": index + 1,
				"Tên thiết bị": item.name,
				"Địa chỉ IP": item.ip_address,
				"Vị trí lắp đặt": item.location,
				"Trạng thái": item.is_online ? t("camera.enabled") : t("camera.deactivated"),
				"Lần kiểm tra cuối": formatDate(item.last_check),
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên thiết bị", "Địa chỉ IP", "Vị trí lắp đặt", "Trạng thái", "Lần kiểm tra cuối"],
			});
			worksheet["!cols"] = [{ wch: 5 }, { wch: 25 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 25 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "DanhsachCamera");
			XLSX.writeFile(workbook, "danh_muc_camera.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error("Export failed", error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const columns: ProColumns<DanhsachCameraItemType>[] = [
		...getConstantColumns(t),
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 80,
			fixed: "right",
			render: (_, record, __, action) => [
				<BasicButton
					key="editable"
					type="link"
					size="small"
					onClick={() => {
						setIsOpen(true);
						setTitle(t("common.edit"));
						setDetailData(record);
						console.warn("detailData set to:", record);
					}}
				>
					{t("common.edit")}
				</BasicButton>,
				<Popconfirm
					key="delete"
					title={t("common.confirmDelete")}
					onConfirm={() => handleDeleteRow(record.id!, action)}
					okText={t("common.confirm")}
					cancelText={t("common.cancel")}
				>
					<BasicButton key="delete-btn" type="link" size="small" danger>
						{t("common.delete")}
					</BasicButton>
				</Popconfirm>,
			],
		},
	];

	return (
		<BasicContent>
			<Card style={{ marginBottom: 16 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("camera.khuVuc")}
						</label>
						<Input
							placeholder={t("common.search")}
							value={searchName}
							onChange={e => setSearchName(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("camera.ipAddress")}
						</label>
						<Input
							placeholder={t("common.search")}
							value={searchIp}
							onChange={e => setSearchIp(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("camera.location")}
						</label>
						<Input
							placeholder={t("common.search")}
							value={searchLocation}
							onChange={e => setSearchLocation(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("camera.status")}
						</label>
						<Select
							style={{ width: "50%" }}
							placeholder={t("common.all")}
							value={searchStatus}
							onChange={value => setSearchStatus(value)}
							options={[
								{ label: t("common.all"), value: null },
								{ label: t("camera.enabled"), value: true },
								{ label: t("camera.deactivated"), value: false },
							]}
							allowClear
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: 12, justifyContent: "flex-end" }}>
					<Button
						icon={<ClearOutlined />}
						onClick={handleClearFilters}
					>
						{t("common.clear")}
					</Button>
				</Row>
			</Card>

			<BasicTable<DanhsachCameraItemType>
				headerTitle={t("camera.Danhsachcamera")}
				actionRef={actionRef}
				rowKey="id"
				search={false}
				columns={columns}
				request={async () => {
					try {
						const data = await fetchDanhsachCamerasList();
						const filteredData = filterCameras(data);
						return {
							data: filteredData,
							success: true,
							total: filteredData.length,
						};
					}
					catch (error) {
						console.error("Failed to load cameras:", error);
						// Return empty data to stop loading
						return {
							data: [],
							success: false,
							total: 0,
						};
					}
				}}
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
				}}
				toolBarRender={() => {
					const toolbarItems = [
						<BasicButton
							key="add"
							type="primary"
							icon={<PlusCircleOutlined />}
							onClick={() => {
								setIsOpen(true);
								setTitle(t("common.add"));
								setDetailData({});
							}}
						>
							{t("common.add")}
						</BasicButton>,
						<Upload
							key="checkStatus"
							accept=".xlsx,.xls,.csv"
							showUploadList={false}
							beforeUpload={handleCheckStatusFile}
							disabled={checkingStatus}
						>
							<Button type="default" icon={<UploadOutlined />} loading={checkingStatus} style={{ marginLeft: 8 }}>
								{checkingStatus ? (t("camera.checkingStatus") || "Checking...") : (t("camera.checkStatus") || "Check Status")}
							</Button>
						</Upload>,
						<Button key="template" onClick={handleDownloadTemplate}>
							{t("common.downloadTemplate") || "Download Template"}
						</Button>,
						<Upload
							key="upload"
							accept=".xlsx,.xls"
							showUploadList={false}
							beforeUpload={handleUploadFile}
							disabled={importing}
						>
							<Button key="import" icon={<UploadOutlined />} loading={importing}>
								{t("common.importExcel") || "Import Excel"}
							</Button>
						</Upload>,
						<Button key="export" onClick={handleExportExcel}>
							{t("common.export")}
						</Button>,
					];

					// Add delete multiple button if items are selected
					if (selectedRowKeys.length > 0) {
						toolbarItems.splice(
							2,
							0,
							<Popconfirm
								key="deleteMultiple"
								title={t("common.confirmDelete")}
								description={`${t("common.delete")} ${selectedRowKeys.length} ${t("common.items") || "items"}?`}
								onConfirm={handleDeleteMultiple}
								okText={t("common.confirm")}
								cancelText={t("common.cancel")}
							>
								<Button
									key="deleteBtn"
									danger
									icon={<DeleteOutlined />}
								>
									{t("common.delete")}
									{" "}
									(
									{selectedRowKeys.length}
									)
								</Button>
							</Popconfirm>,
						);
					}

					return toolbarItems;
				}}
			/>

			<Detail
				open={isOpen}
				title={title}
				treeData={[]}
				detailData={detailData}
				onCloseChange={() => setIsOpen(false)}
				refreshTable={() => actionRef.current?.reload?.()}
			/>

		</BasicContent>
	);
}
