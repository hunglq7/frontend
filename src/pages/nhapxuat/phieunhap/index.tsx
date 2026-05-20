import type { ActionType } from "@ant-design/pro-components";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types.js";
import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/index";
import { message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { fetchDanhMucDonViList } from "#src/api/danhmuc/donvi/index";
import {
	fetchAddPhieuNhapItem,
	fetchDeleteMultiplePhieuNhapItems,
	fetchDeletePhieuNhapItem,
	fetchPhieuNhapList,
	fetchUpdatePhieuNhapItem,
} from "#src/api/nhapxuat/phieunhap/index";
import { BasicContent } from "#src/components/basic-content";

import PhieuNhapModal from "./components/PhieuNhapModal";
import PhieuNhapTable from "./components/PhieuNhapTable";
import PhieuNhapToolBar from "./components/PhieuNhapToolBar";

function PhieuNhapPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord] = useState<PhieuNhapItemType | null>(
		null,
	);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<PhieuNhapItemType[]>([]);
	const [filteredData, setFilteredData] = useState<PhieuNhapItemType[]>([]);
	const [donViList, setDonViList] = useState<DanhMucDonViItemType[]>([]);

	// Fetch danh sách đơn vị khi component được mount
	useEffect(() => {
		const fetchDonVi = async () => {
			try {
				const result = await fetchDanhMucDonViList();
				setDonViList(result);
			}
			catch (error) {
				message.error(`Lỗi khi tải danh sách đơn vị: ${error}`);
			}
		};

		fetchDonVi();
	}, []);

	const handleSubmit = async (values: any) => {
		const payload = {
			...values,
			ngay_nhap: values.ngay_nhap
				? dayjs(values.ngay_nhap).format("YYYY-MM-DD")
				: undefined,
		};
		try {
			if (editingRecord) {
				await fetchUpdatePhieuNhapItem(editingRecord.id, payload);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddPhieuNhapItem(payload);
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
			await fetchDeletePhieuNhapItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMultiplePhieuNhapItems(selectedRowKeys as number[]);
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
				<PhieuNhapTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={false}
					donViList={donViList}
					request={async (params: any) => {
						try {
							const result = await fetchPhieuNhapList();
							setTableData(result);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.ma_phieu_nhap) {
								filtered = result.filter(item =>
									item.ma_phieu_nhap
										.toLowerCase()
										.includes(params.ma_phieu_nhap.toLowerCase()),
								);
							}
							if (params.ngay_nhap) {
								const searchDate = dayjs(params.ngay_nhap, "DD/MM/YYYY").format(
									"YYYY-MM-DD",
								);

								filtered = filtered.filter((item) => {
									const itemDate = dayjs(item.ngay_nhap).format("YYYY-MM-DD");
									return itemDate === searchDate;
								});
							}
							if (params.don_vi_id) {
								filtered = filtered.filter(
									item => Number(item.don_vi_id) === Number(params.don_vi_id),

								);
							}
							if (params.nguoi_nhap) {
								filtered = result.filter(item =>
									item.nguoi_nhap
										.toLowerCase()
										.includes(params.nguoi_nhap.toLowerCase()),
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
						onChange: (keys: React.Key[]) => {
							setSelectedRowKeys(keys);
						},
					}}
					toolbar={(
						<PhieuNhapToolBar
							selectedRowKeys={selectedRowKeys}
							onAdd={() => {
								setEditingRecord(null);
								setOpenModal(true);
							}}
							onDeleteMany={handleDeleteMany}
							data={filteredData}
						/>
					)}
				/>

				<PhieuNhapModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
					donViList={donViList}
				/>
			</BasicContent>
		</>
	);
}

export default PhieuNhapPage;
