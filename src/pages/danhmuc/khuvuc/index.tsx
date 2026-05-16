import type { ActionType } from "@ant-design/pro-components";
import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types.js";
import { message } from "antd";
import { useRef, useState } from "react";
import {
	fetchAddKhuVucItem,
	fetchDeleteKhuVucItem,
	fetchDeleteMultipleKhuVucItems,
	fetchKhuVucList,
	fetchUpdateKhuVucItem,
} from "#src/api/danhmuc/khuvuc";
import { BasicContent } from "#src/components/basic-content";

import KhuVucModal from "./components/KhuVucModal";
import KhuVucTable from "./components/KhuVucTable";
import KhuVucToolBar from "./components/KhuVucToolBar";

function KhuVucPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<KhuVucItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys]
		= useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<
		KhuVucItemType[]
	>([]);
	const [filteredData, setFilteredData] = useState<
		KhuVucItemType[]
	>([]);

	const handleSubmit = async (values: any) => {
		try {
			if (editingRecord) {
				await fetchUpdateKhuVucItem(editingRecord.id, values);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddKhuVucItem(values);
				message.success("Thêm thành công");
			}

			setOpenModal(false);
			setEditingRecord(null);
			actionRef.current?.reload();
			return true;
		}
		catch (error) {
			message.error(`Có lỗi xảy ra: ${error}`);
			return false;
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await fetchDeleteKhuVucItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMultipleKhuVucItems(
				selectedRowKeys as number[],
			);
			message.success("Xóa nhiều thành công");
			setSelectedRowKeys([]);
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	return (
		<>
			<BasicContent>
				<KhuVucTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={false}
					request={async (params: any) => {
						try {
							const result = await fetchKhuVucList();
							setTableData(result);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.ten_khu_vuc) {
								filtered = result.filter(item =>
									item.ten_khu_vuc.toLowerCase().includes(params.ten_khu_vuc.toLowerCase()),
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
							return {
								data: [],
								success: false,
								total: 0,
							};
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
						<KhuVucToolBar
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

				<KhuVucModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
				/>
			</BasicContent>
		</>
	);
}

export default KhuVucPage;
