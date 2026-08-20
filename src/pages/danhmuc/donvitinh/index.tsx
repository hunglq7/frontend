import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import type { ActionType } from "@ant-design/pro-components";
import {
	fetchAddDonViTinhItem,
	fetchDeleteDonViTinhItem,
	fetchDeleteMultipleDonViTinhItems,
	fetchDonViTinhList,
	fetchUpdateDonViTinhItem,
} from "#src/api/danhmuc/donvitinh";
import { BasicContent } from "#src/components/basic-content";
import { message } from "antd";
import { useRef, useState } from "react";
import DonViTinhModal from "./components/DonViTinhModal";
import DonViTinhTable from "./components/DonViTinhTable";
import DonViTinhToolBar from "./components/DonViTinhToolBar";

function DonViTinhPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<DonViTinhItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys]
		= useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<
		DonViTinhItemType[]
	>([]);
	const [filteredData, setFilteredData] = useState<
		DonViTinhItemType[]
	>([]);

	const handleSubmit = async (values: any) => {
		try {
			if (editingRecord) {
				await fetchUpdateDonViTinhItem(editingRecord.id, values);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddDonViTinhItem(values);
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
			await fetchDeleteDonViTinhItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMultipleDonViTinhItems(
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
				<DonViTinhTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={false}
					request={async (params: any) => {
						try {
							const result = await fetchDonViTinhList();
							setTableData(result);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.ten_don_vi_tinh) {
								filtered = result.filter(item =>
									item.ten_don_vi_tinh.toLowerCase().includes(params.ten_don_vi_tinh.toLowerCase()),
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
						<DonViTinhToolBar
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

				<DonViTinhModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
				/>
			</BasicContent>
		</>
	);
}

export default DonViTinhPage;
