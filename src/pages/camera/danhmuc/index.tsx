import type { DanhMucCameraItemType } from "#src/api/camera/danhmuc/types.js";
import type { ActionType } from "@ant-design/pro-components";
import {
	fetchAddDanhMucCameraItem,
	fetchDanhMucCameraList,
	fetchDeleteDanhMucCameraItem,
	fetchDeleteMultipleDanhMucCamera,
	fetchUpdateDanhMucCameraItem,
} from "#src/api/camera/danhmuc/index.js";
import { BasicContent } from "#src/components/basic-content";
import { message } from "antd";
import { useRef, useState } from "react";

import DanhmucCameraModal from "./components/DanhmucCameraModal";
import DanhmucCameraTable from "./components/DanhmucCameraTable";
import DanhmucCameraToolBar from "./components/DanhmucCameraToolBar";

function DanhmucCameraPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<DanhMucCameraItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys]
		= useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<
		DanhMucCameraItemType[]
	>([]);
	const [filteredData, setFilteredData] = useState<
		DanhMucCameraItemType[]
	>([]);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (values: any) => {
		try {
			setLoading(true);
			if (editingRecord) {
				await fetchUpdateDanhMucCameraItem(editingRecord.id, values);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddDanhMucCameraItem(values);
				message.success("Thêm thành công");
			}

			setOpenModal(false);
			setEditingRecord(null);
			await actionRef.current?.reload?.();
			return true;
		}
		catch (error) {
			message.error(`Lỗi hệ thống: ${error}`);
			return false;
		}
		finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			setLoading(true);
			await fetchDeleteDanhMucCameraItem(id);
			message.success("Xóa thành công");
			await actionRef.current?.reload?.();
		}
		catch (error) {
			message.error(`Lỗi hệ thống: ${error}`);
		}
		finally {
			setLoading(false);
		}
	};

	const handleDeleteMany = async () => {
		try {
			setLoading(true);
			await fetchDeleteMultipleDanhMucCamera(
				selectedRowKeys as number[],
			);
			message.success("Xóa bản ghi đã chọn thành công");
			setSelectedRowKeys([]);
			await actionRef.current?.reload?.();
		}
		catch (error) {
			message.error(`Lỗi hệ thống: ${error}`);
		}
		finally {
			setLoading(false);
		}
	};

	return (
		<>
			<BasicContent>
				<DanhmucCameraTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={loading}
					request={async (params: any) => {
						try {
							setLoading(true);
							const result = (await fetchDanhMucCameraList()) as unknown as DanhMucCameraItemType[];
							setTableData(result);
							let filtered = result;
							if (params.ten_thiet_bi) {
								filtered = filtered.filter(item =>
									item.ten_thiet_bi?.toLowerCase().includes(params.ten_thiet_bi.toLowerCase()),
								);
							}
							if (params.thong_so_ky_thuat) {
								filtered = filtered.filter(item =>
									item.thong_so_ky_thuat?.toLowerCase().includes(params.thong_so_ky_thuat.toLowerCase()),
								);
							}
							if (params.hang_san_xuat) {
								filtered = filtered.filter(item =>
									item.hang_san_xuat?.toLowerCase().includes(params.hang_san_xuat.toLowerCase()),
								);
							}
							if (params.nuoc_san_xuat) {
								filtered = filtered.filter(item =>
									item.nuoc_san_xuat?.toLowerCase().includes(params.nuoc_san_xuat.toLowerCase()),
								);
							}
							setFilteredData(filtered);
							return {
								data: filtered,
								success: true,
								total: filtered?.length || 0,
							};
						}
						catch (error) {
							console.error("Error fetching data:", error);
							setTableData([]);
							setFilteredData([]);
							return {
								data: [],
								success: false,
								total: 0,
							};
						}
						finally {
							setLoading(false);
						}
					}}
					onEdit={(record) => {
						setEditingRecord(record);
						setOpenModal(true);
					}}
					onDelete={handleDelete}
					rowSelection={{
						selectedRowKeys,
						onChange: (
							keys: React.Key[],
						) => {
							setSelectedRowKeys(keys);
						},
					}}
					toolbar={(
						<DanhmucCameraToolBar
							selectedRowKeys={
								selectedRowKeys
							}
							onAdd={() => {
								setEditingRecord(null);
								setOpenModal(true);
							}}
							onDeleteMany={
								handleDeleteMany
							}
							data={filteredData}
						/>
					)}
				/>

				<DanhmucCameraModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
				/>
			</BasicContent>
		</>
	);
}

export default DanhmucCameraPage;
