import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import {
	fetchAddViTriLapDatItem,
	fetchDeleteMultipleViTriLapDatItems,
	fetchDeleteViTriLapDatItem,
	fetchUpdateViTriLapDatItem,
	fetchViTriLapDatList,
} from "#src/api/danhmuc/vitri/index";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";
import { ClearOutlined, DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Popconfirm, Row } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import { Detail } from "./component/detail";
import { getConstantColumns } from "./constants";

export default function ViTriLapDat() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<ViTriLapDatItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [searchTenViTri, setSearchTenViTri] = useState("");
	const [searchMoTa, setSearchMoTa] = useState("");
	const actionRef = useRef<ActionType>(null);

	const handleClearFilters = () => {
		setSearchTenViTri("");
		setSearchMoTa("");
		actionRef.current?.reload?.();
	};

	// Xóa một bản ghi
	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteViTriLapDatItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	// Xóa nhiều bản ghi
	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0) {
			return;
		}
		await fetchDeleteMultipleViTriLapDatItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const filterData = (data: ViTriLapDatItemType[]) => {
		return data.filter((item) => {
			const matchTenViTri = searchTenViTri === "" || (item.ten_vi_tri?.toLowerCase().includes(searchTenViTri.toLowerCase()) ?? false);
			const matchMoTa = searchMoTa === "" || (item.mo_ta?.toLowerCase().includes(searchMoTa.toLowerCase()) ?? false);
			return matchTenViTri && matchMoTa;
		});
	};

	const exportExcel = async () => {
		try {
			const data = await fetchViTriLapDatList();
			const exportData = filterData(data).map((item, index) => ({
				"STT": index + 1,
				"Tên vị trí": item.ten_vi_tri,
				"Mô tả": item.mo_ta || "",
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên vị trí", "Mô tả"],
			});
			worksheet["!cols"] = [{ wch: 6 }, { wch: 30 }, { wch: 50 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "ViTriLapDat");
			XLSX.writeFile(workbook, "vi_tri_lap_dat.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error("Export failed", error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	// Xử lý thêm mới
	const handleAdd = async (values: ViTriLapDatItemType) => {
		await fetchAddViTriLapDatItem({
			ten_vi_tri: values.ten_vi_tri,
			mo_ta: values.mo_ta,
		});
		await actionRef.current?.reload();
		window.$message?.success(t("common.addSuccess"));
	};

	// Xử lý cập nhật
	const handleUpdate = async (values: ViTriLapDatItemType) => {
		if (detailData.id) {
			await fetchUpdateViTriLapDatItem(detailData.id, {
				ten_vi_tri: values.ten_vi_tri,
				mo_ta: values.mo_ta,
			});
			await actionRef.current?.reload();
			window.$message?.success(t("common.updateSuccess"));
		}
	};

	const columns: ProColumns<ViTriLapDatItemType>[] = [
		...getConstantColumns(t),
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 160,
			fixed: "right",
			render: (_, record, __, action) => [
				<BasicButton
					key="editable"
					type="link"
					size="small"
					disabled={false}
					onClick={() => {
						setIsOpen(true);
						setTitle(t("danhmuc.editViTri"));
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
					<BasicButton
						type="link"
						size="small"
						danger
						disabled={false}
					>
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
					<Col xs={24} sm={12} md={8}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("danhmuc.tenViTri")}
						</label>
						<Input
							placeholder={t("common.search")}
							value={searchTenViTri}
							onChange={e => setSearchTenViTri(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
							{t("danhmuc.moTa")}
						</label>
						<Input
							placeholder={t("common.search")}
							value={searchMoTa}
							onChange={e => setSearchMoTa(e.target.value)}
							allowClear
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: 12, justifyContent: "flex-end" }}>
					<Button icon={<ClearOutlined />} onClick={handleClearFilters}>
						{t("common.clear")}
					</Button>
				</Row>
			</Card>

			<BasicTable<ViTriLapDatItemType>
				headerTitle={t("danhmuc.viTriLapDatManagement")}
				actionRef={actionRef}
				rowKey="id"
				search={false}
				columns={columns}
				request={async () => {
					const data = await fetchViTriLapDatList();
					const filtered = filterData(data);
					return {
						data: filtered,
						success: true,
						total: filtered.length,
					};
				}}
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
				}}
				toolBarRender={() => [
					<BasicButton
						key="add"
						type="primary"
						icon={<PlusCircleOutlined />}
						disabled={false}
						onClick={() => {
							setIsOpen(true);
							setTitle(t("danhmuc.addViTri"));
							setDetailData({});
						}}
					>
						{t("common.add")}
					</BasicButton>,
					<Button
						key="bulk-delete"
						danger
						disabled={selectedRowKeys.length === 0 || !hasAccessByCodes(accessControlCodes.delete)}
						onClick={handleBulkDelete}
					>
						{t("common.bulkDelete")}
					</Button>,
					<BasicButton
						key="export"
						icon={<DownloadOutlined />}
						onClick={exportExcel}
					>
						{t("common.export")}
					</BasicButton>,
				]}
			/>

			<Detail
				open={isOpen}
				setOpen={setIsOpen}
				title={title}
				detailData={detailData}
				onFinish={detailData.id ? handleUpdate : handleAdd}
			/>
		</BasicContent>
	);
}
