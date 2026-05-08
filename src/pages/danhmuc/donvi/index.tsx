import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import {
	fetchAddDanhMucDonViItem,
	fetchDanhMucDonViList,
	fetchDeleteDanhMucDonViItem,
	fetchDeleteMultipleDanhMucDonViItems,
	fetchUpdateDanhMucDonViItem,
} from "#src/api/danhmuc/donvi/index";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";
import { Detail } from "./component/detail";
import { getConstantColumns } from "./constants";

export default function DanhMucDonVi() {
	const { t } = useTranslation();
	const { hasAccessByCodes } = useAccess();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<DanhMucDonViItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	// Xóa một bản ghi
	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteDanhMucDonViItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	// Xóa nhiều bản ghi
	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0) {
			return;
		}
		await fetchDeleteMultipleDanhMucDonViItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	// Xuất ra file Excel
	const handleExportExcel = async () => {
		try {
			const data = await fetchDanhMucDonViList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Tên đơn vị": item.ten_don_vi,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên đơn vị"],
			});
			// Set độ rộng cột
			worksheet["!cols"] = [{ wch: 5 }, { wch: 25 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "DanhMucDonVi");
			XLSX.writeFile(workbook, "danh_muc_don_vi.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error("Export failed", error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	// Xử lý thêm mới
	const handleAdd = async (values: DanhMucDonViItemType) => {
		await fetchAddDanhMucDonViItem({
			ten_don_vi: values.ten_don_vi,
		});
		await actionRef.current?.reload();
		window.$message?.success(t("common.addSuccess"));
	};

	// Xử lý cập nhật
	const handleUpdate = async (values: DanhMucDonViItemType) => {
		if (detailData.id) {
			await fetchUpdateDanhMucDonViItem(detailData.id, {
				ten_don_vi: values.ten_don_vi,
			});
			await actionRef.current?.reload();
			window.$message?.success(t("common.updateSuccess"));
		}
	};

	const columns: ProColumns<DanhMucDonViItemType>[] = [
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
						setTitle(t("danhmuc.editDonVi"));
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
			<BasicTable<DanhMucDonViItemType>
				headerTitle={t("danhmuc.donViManagement")}
				actionRef={actionRef}
				rowKey="id"
				search={false}
				columns={columns}
				request={async (_params, _sorter) => {
					const data = await fetchDanhMucDonViList();
					return {
						data,
						success: true,
						total: data.length,
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
							setTitle(t("danhmuc.addDonVi"));
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
						onClick={handleExportExcel}
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
