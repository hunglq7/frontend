import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import type { ActionType } from "@ant-design/pro-components";
import {
	fetchAddViTriLapDatItem,
	fetchDeleteMultipleViTriLapDatItems,
	fetchDeleteViTriLapDatItem,
	fetchUpdateViTriLapDatItem,
	fetchViTriLapDatList,
} from "#src/api/danhmuc/vitri/index";
import { BasicContent } from "#src/components/basic-content";
import { message } from "antd";
import { useRef, useState } from "react";
import VitriModal from "./component/VitriModel";
import VitriTable from "./component/VitriTable";
import VitriToolBar from "./component/VitriToolbar";

function VitriPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<ViTriLapDatItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys]
		= useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<
		ViTriLapDatItemType[]
	>([]);
	const [filteredData, setFilteredData] = useState<
		ViTriLapDatItemType[]
	>([]);

	const handleSubmit = async (values: any) => {
		try {
			if (editingRecord) {
				await fetchUpdateViTriLapDatItem(editingRecord.id, values);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddViTriLapDatItem(values);
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
			await fetchDeleteViTriLapDatItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMultipleViTriLapDatItems(
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
				<VitriTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={false}
					request={async (params: any) => {
						try {
							const result = await fetchViTriLapDatList();
							setTableData(result);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.ten_vi_tri) {
								filtered = result.filter(item =>
									item.ten_vi_tri.toLowerCase().includes(params.ten_vi_tri.toLowerCase()),
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
						<VitriToolBar
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

				<VitriModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
				/>
			</BasicContent>
		</>
	);
}

export default VitriPage;
