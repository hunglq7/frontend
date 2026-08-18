import type { DanhMucCapDienThoaiItemType } from "#src/api/capthongtin/danhmuc/index.js";
import type { ActionType } from "@ant-design/pro-components";
import {
	fetchCreateDanhmuccapdienthoai,
	fetchDanhmuccapdienthoaiList,
	fetchDeleteDanhmuccapdienthoai,
	fetchDeleteMutipleDanhmuccapdienthoai,
	fetchUpdateDanhmuccapdienthoai,
} from "#src/api/capthongtin/danhmuc";
import { BasicContent } from "#src/components/basic-content";
import { message } from "antd";
import { useRef, useState } from "react";

import CapdienthoaiToolBar from "./components//CapdienthoaiToolBar";
import CapdienthoaiModal from "./components/CapdienthoaiModal";
import CapdienthoaiTable from "./components/CapdienthoaiTable";

function CapdienthoaiPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<DanhMucCapDienThoaiItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys]
		= useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<
		DanhMucCapDienThoaiItemType[]
	>([]);
	const [filteredData, setFilteredData] = useState<
		DanhMucCapDienThoaiItemType[]
	>([]);

	const handleSubmit = async (values: any) => {
		try {
			if (editingRecord) {
				await fetchUpdateDanhmuccapdienthoai(editingRecord.id, values);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchCreateDanhmuccapdienthoai(values);
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
			await fetchDeleteDanhmuccapdienthoai(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMutipleDanhmuccapdienthoai(
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
				<CapdienthoaiTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={false}
					request={async (params: any) => {
						try {
							const result = await fetchDanhmuccapdienthoaiList();
							setTableData(result);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.tenCap) {
								filtered = result.filter(item =>
									item.tenCap.toLowerCase().includes(params.tenCap.toLowerCase()),
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
						<CapdienthoaiToolBar
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

				<CapdienthoaiModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
				/>
			</BasicContent>
		</>
	);
}

export default CapdienthoaiPage;
