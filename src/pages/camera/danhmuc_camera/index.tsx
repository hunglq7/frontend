import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { DanhMucCameraItemType } from "#src/api/camera/danhmuc_camera/types";
import { ClearOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Popconfirm, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	fetchDanhMucCameraList,
	fetchDeleteDanhMucCameraItem,
	fetchDeleteMultipleDanhMucCamera,
} from "#src/api/camera/danhmuc_camera/index";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";

import { Detail } from "./component/detail";
import { getConstantColumns } from "./constants";

export default function DanhMucCamera() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<DanhMucCameraItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	// Search states
	const [searchTenThietBi, setSearchTenThietBi] = useState("");
	const [searchHangSanXuat, setSearchHangSanXuat] = useState("");
	const [searchNuocSanXuat, setSearchNuocSanXuat] = useState("");

	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		try {
			await fetchDeleteDanhMucCameraItem(id);
			setSelectedRowKeys([]);
			await action?.reload?.();
			window.$message?.success(t("common.deleteSuccess"));
		}
		catch (error) {
			console.error("Delete failed", error);
			window.$message?.error(t("common.deleteFailed") || "Xóa thất bại");
		}
	};

	const handleDeleteMultiple = async () => {
		try {
			await fetchDeleteMultipleDanhMucCamera(selectedRowKeys as number[]);
			window.$message?.success(
				t("common.deleteSuccess") || `Đã xóa thành công ${selectedRowKeys.length} mục`,
			);
			setSelectedRowKeys([]);
			await actionRef.current?.reload?.();
		}
		catch (error) {
			console.error("Delete multiple failed", error);
			window.$message?.error(t("common.deleteFailed") || "Xóa thất bại");
		}
	};

	const filterCameras = (cameras: DanhMucCameraItemType[]): DanhMucCameraItemType[] => {
		return cameras.filter((camera) => {
			const matchTenThietBi = searchTenThietBi === "" || (camera.ten_thiet_bi?.toLowerCase().includes(searchTenThietBi.toLowerCase()) ?? false);
			const matchHangSanXuat = searchHangSanXuat === "" || (camera.hang_san_xuat?.toLowerCase().includes(searchHangSanXuat.toLowerCase()) ?? false);
			const matchNuocSanXuat = searchNuocSanXuat === "" || (camera.nuoc_san_xuat?.toLowerCase().includes(searchNuocSanXuat.toLowerCase()) ?? false);

			return matchTenThietBi && matchHangSanXuat && matchNuocSanXuat;
		});
	};

	const handleClearFilters = () => {
		setSearchTenThietBi("");
		setSearchHangSanXuat("");
		setSearchNuocSanXuat("");
		actionRef.current?.reload?.();
	};

	// Reload table when search filters change
	useEffect(() => {
		actionRef.current?.reload?.();
	}, [searchTenThietBi, searchHangSanXuat, searchNuocSanXuat]);

	const columns: ProColumns<DanhMucCameraItemType>[] = [
		...getConstantColumns(t),
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 150,
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
					<BasicButton type="link" size="small" danger>
						{t("common.delete")}
					</BasicButton>
				</Popconfirm>,
			],
		},
	];

	return (
		<BasicContent>
			{/* Search Filters */}
			<Card style={{ marginBottom: 16 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={8}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("danhmuc.tenThietBi")}
						</label>
						<Input
							placeholder={t("common.search")}
							value={searchTenThietBi}
							onChange={e => setSearchTenThietBi(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("danhmuc.hangSanXuat")}
						</label>
						<Input
							placeholder={t("common.search")}
							value={searchHangSanXuat}
							onChange={e => setSearchHangSanXuat(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("danhmuc.nuocSanXuat")}
						</label>
						<Input
							placeholder={t("common.search")}
							value={searchNuocSanXuat}
							onChange={e => setSearchNuocSanXuat(e.target.value)}
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

			{/* Table */}
			<BasicTable<DanhMucCameraItemType>
				headerTitle={t("danhmuc.danhMucCamera")}
				actionRef={actionRef}
				rowKey="id"
				search={false}
				columns={columns}
				request={async () => {
					const data = await fetchDanhMucCameraList();
					const filteredData = filterCameras(data);
					return {
						data: filteredData,
						success: true,
						total: filteredData.length,
					};
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
					];

					// Add delete multiple button if items are selected
					if (selectedRowKeys.length > 0) {
						toolbarItems.push(
							<Popconfirm
								key="deleteMultiple"
								title={t("common.confirmDelete")}
								description={`${t("common.delete")} ${selectedRowKeys.length} ${t("common.items") || "mục"}?`}
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
				detailData={detailData}
				onCloseChange={() => setIsOpen(false)}
				refreshTable={() => actionRef.current?.reload?.()}
			/>
		</BasicContent>
	);
}
