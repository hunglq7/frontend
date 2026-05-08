import type { ActionType, ProCoreActionType } from "@ant-design/pro-components";
import type { DanhMucChucVuItemType } from "#src/api/danhmuc/chucvu/types.js";
import { DownloadOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";

import {
	fetchAddDanhMucChucVuItem,
	fetchDanhMucChucVuList,
	fetchDeleteDanhMucChucVuItem,
	fetchDeleteMultipleDanhMucChucVuItems,
	fetchUpdateDanhMucChucVuItem,
} from "#src/api/danhmuc/chucvu/index";

import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";

import { AddForm, SearchForm } from "./components";
import { getTableColumns } from "./components/TableColumns";

export default function DanhMucChucVu() {
	const { t } = useTranslation();
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [searchTenChucVu, setSearchTenChucVu] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editingValue, setEditingValue] = useState("");
	const [addingNew, setAddingNew] = useState(false);
	const [newValue, setNewValue] = useState("");
	const actionRef = useRef<ActionType>(null);

	const handleClearFilters = () => {
		setSearchTenChucVu("");
		actionRef.current?.reload?.();
	};

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		try {
			await fetchDeleteDanhMucChucVuItem(id);
			setSelectedRowKeys([]);
			await action?.reload?.();
			window.$message?.success(t("common.deleteSuccess") || "Xóa thành công");
		}
		catch (error) {
			console.error("Delete failed", error);
			window.$message?.error(t("common.deleteFailed") || "Xóa thất bại");
		}
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0) {
			return;
		}
		try {
			await fetchDeleteMultipleDanhMucChucVuItems(selectedRowKeys as number[]);
			setSelectedRowKeys([]);
			await actionRef.current?.reload?.();
			window.$message?.success(t("common.deleteSuccess") || "Xóa thành công");
		}
		catch (error) {
			console.error("Bulk delete failed", error);
			window.$message?.error(t("common.deleteFailed") || "Xóa thất bại");
		}
	};

	const handleAddNew = async () => {
		if (!newValue.trim()) {
			window.$message?.warning("Vui lòng nhập tên thiết bị");
			return;
		}
		try {
			await fetchAddDanhMucChucVuItem({ ten_chuc_vu: newValue });
			setNewValue("");
			setAddingNew(false);
			await actionRef.current?.reload?.();
			window.$message?.success(t("common.addSuccess") || "Thêm mới thành công");
		}
		catch (error) {
			console.error("Add failed", error);
			window.$message?.error(t("common.addFailed") || "Thêm mới thất bại");
		}
	};

	const handleStartEdit = (record: DanhMucChucVuItemType) => {
		setEditingId(record.id || null);
		setEditingValue(record.ten_chuc_vu);
	};

	const handleSaveEdit = async () => {
		if (!editingValue.trim()) {
			window.$message?.warning("Vui lòng nhập tên chức vụ");
			return;
		}
		try {
			if (editingId) {
				await fetchUpdateDanhMucChucVuItem(editingId, { ten_chuc_vu: editingValue });
				setEditingId(null);
				setEditingValue("");
				await actionRef.current?.reload?.();
				window.$message?.success(t("common.updateSuccess") || "Cập nhật thành công");
			}
		}
		catch (error) {
			console.error("Update failed", error);
			window.$message?.error(t("common.updateFailed") || "Cập nhật thất bại");
		}
	};

	const filterData = (data: DanhMucChucVuItemType[]) => {
		return data.filter((item) => {
			return searchTenChucVu === "" || item.ten_chuc_vu?.toLowerCase().includes(searchTenChucVu.toLowerCase());
		});
	};

	const exportExcel = async () => {
		try {
			const data = await fetchDanhMucChucVuList();
			const exportData = filterData(data).map((item, index) => ({
				"STT": index + 1,
				"Tên chức vụ": item.ten_chuc_vu,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Tên chức vụ"],
			});
			worksheet["!cols"] = [{ wch: 6 }, { wch: 40 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "DanhMucChucVu");
			XLSX.writeFile(workbook, "danh_muc_chuc_vu.xlsx");
			window.$message?.success(t("common.exportSuccess") || "Xuất file thành công");
		}
		catch (error) {
			console.error("Export failed", error);
			window.$message?.error(t("common.exportFailed") || "Xuất file thất bại");
		}
	};

	const columns = getTableColumns({
		editingId,
		editingValue,
		setEditingValue,
		setEditingId,
		handleSaveEdit,
		handleStartEdit,
		handleDeleteRow,
		t,
	});

	return (
		<BasicContent>
			<SearchForm
				searchTenChucVu={searchTenChucVu}
				setSearchTenChucVu={setSearchTenChucVu}
				onClearFilters={handleClearFilters}
			/>

			{addingNew && (
				<AddForm
					newValue={newValue}
					setNewValue={setNewValue}
					onSave={handleAddNew}
					onCancel={() => {
						setAddingNew(false);
						setNewValue("");
					}}
				/>
			)}

			<BasicTable<DanhMucChucVuItemType>
				headerTitle={t("danhmuc.chucVuManagement") || "Danh mục chức vụ"}
				actionRef={actionRef}
				rowKey="id"
				search={false}
				columns={columns}
				request={async () => {
					const data = await fetchDanhMucChucVuList();
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
						onClick={() => setAddingNew(true)}
						disabled={addingNew}
					>
						{t("common.add") || "Thêm mới"}
					</BasicButton>,
					<Button
						key="bulk-delete"
						danger
						disabled={selectedRowKeys.length === 0}
						onClick={handleBulkDelete}
					>
						{t("common.bulkDelete") || "Xóa nhiều"}
					</Button>,
					<BasicButton
						key="export"
						icon={<DownloadOutlined />}
						onClick={exportExcel}
					>
						{t("common.export") || "Xuất Excel"}
					</BasicButton>,
				]}
			/>

		</BasicContent>
	);
}
