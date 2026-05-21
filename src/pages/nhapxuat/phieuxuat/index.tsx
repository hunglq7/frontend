import type { ActionType } from "@ant-design/pro-components";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types.js";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types.js";
import type { PhieuXuatItemType } from "#src/api/nhapxuat/phieuxuat/types.js";
import { message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { fetchDanhMucDonViList } from "#src/api/danhmuc/donvi/index";
import { fetchViTriLapDatList } from "#src/api/danhmuc/vitri/index.js";
import {
	fetchAddPhieuXuatItem,
	fetchDeleteMultiplePhieuXuatItems,
	fetchDeletePhieuXuatItem,
	fetchPhieuXuatList,
	fetchUpdatePhieuXuatItem,
} from "#src/api/nhapxuat/phieuxuat/index";
import { BasicContent } from "#src/components/basic-content";

import PhieuXuatModal from "./components/PhieuXuatModal";
import PhieuXuatTable from "./components/PhieuXuatTable";
import PhieuXuatToolBar from "./components/PhieuXuatToolBar";

function PhieuXuatPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord] = useState<PhieuXuatItemType | null>(
		null,
	);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<PhieuXuatItemType[]>([]);
	const [filteredData, setFilteredData] = useState<PhieuXuatItemType[]>([]);
	const [donViList, setDonViList] = useState<DanhMucDonViItemType[]>([]);
	const [viTriList, setViTriList] = useState<ViTriLapDatItemType[]>([]);

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
		const fetchViTri = async () => {
			try {
				const result = await fetchViTriLapDatList();
				setViTriList(result);
			}
			catch (error) {
				message.error(`Lỗi khi tải danh sách vị trí: ${error}`);
			}
		};

		fetchDonVi();
		fetchViTri();
	}, []);

	const handleSubmit = async (values: any) => {
		const payload = {
			...values,
			ngay_xuat: values.ngay_xuat
				? dayjs(values.ngay_xuat).format("YYYY-MM-DD")
				: undefined,
		};
		try {
			if (editingRecord) {
				await fetchUpdatePhieuXuatItem(editingRecord.id, payload);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddPhieuXuatItem(payload);
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
			await fetchDeletePhieuXuatItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMultiplePhieuXuatItems(selectedRowKeys as number[]);
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
				<PhieuXuatTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={false}
					donViList={donViList}
					viTriList={viTriList}
					request={async (params: any) => {
						try {
							const result = await fetchPhieuXuatList();
							setTableData(result);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.ma_phieu_xuat) {
								filtered = result.filter(item =>
									item.ma_phieu_xuat
										.toLowerCase()
										.includes(params.ma_phieu_xuat.toLowerCase()),
								);
							}
							if (params.ngay_xuat) {
								const searchDate = dayjs(params.ngay_xuat, "DD/MM/YYYY").format(
									"YYYY-MM-DD",
								);

								filtered = filtered.filter((item) => {
									const itemDate = dayjs(item.ngay_xuat).format("YYYY-MM-DD");
									return itemDate === searchDate;
								});
							}
							if (params.don_vi_id) {
								filtered = filtered.filter(
									item => Number(item.don_vi_id) === Number(params.don_vi_id),

								);
							}
							if (params.vi_tri_id) {
								filtered = filtered.filter(
									item => Number(item.vi_tri_id) === Number(params.vi_tri_id),
								);
							}
							if (params.nguoi_xuat) {
								filtered = result.filter(item =>
									item.nguoi_xuat
										.toLowerCase()
										.includes(params.nguoi_xuat.toLowerCase()),
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
						<PhieuXuatToolBar
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

				<PhieuXuatModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
					donViList={donViList}
					viTriList={viTriList}
				/>
			</BasicContent>
		</>
	);
}

export default PhieuXuatPage;
