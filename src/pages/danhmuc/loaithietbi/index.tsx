import type { ActionType } from "@ant-design/pro-components";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import { message } from "antd";
import { useRef, useState } from "react";
import {
	fetchAddLoaiThietBiItem,
	fetchDeleteLoaiThietBiItem,
	fetchDeleteMultipleLoaiThietBiItems,
	fetchLoaiThietBiList,
	fetchUpdateLoaiThietBiItem,
} from "#src/api/danhmuc/loaithietbi";
import { BasicContent } from "#src/components/basic-content";
import LoaiThietbiModal from "./components/LoaiThietBiModal";
import LoaiThietbiTable from "./components/LoaiThietBiTable";
import LoaiThietbiToolBar from "./components/LoaiThietBiToolBar";

function LoaiThietBiPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<LoaiThietBiItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys]
		= useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<
		LoaiThietBiItemType[]
	>([]);
	const [filteredData, setFilteredData] = useState<
		LoaiThietBiItemType[]
	>([]);

	const handleSubmit = async (values: any) => {
		try {
			if (editingRecord) {
				await fetchUpdateLoaiThietBiItem(editingRecord.id, values);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddLoaiThietBiItem(values);
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
			await fetchDeleteLoaiThietBiItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMultipleLoaiThietBiItems(
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
				<LoaiThietbiTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={false}
					request={async (params: any) => {
						try {
							const result = await fetchLoaiThietBiList();
							setTableData(result);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.ten_loai) {
								filtered = result.filter(item =>
									item.ten_loai.toLowerCase().includes(params.ten_loai.toLowerCase()),
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
						<LoaiThietbiToolBar
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

				<LoaiThietbiModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
				/>
			</BasicContent>
		</>
	);
}

export default LoaiThietBiPage;
