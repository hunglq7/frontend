import type { ActionType } from "@ant-design/pro-components";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types.js";
import type { ChiTietPhieuNhapItemType } from "#src/api/nhapxuat/chitietphieunhap/index.js";
import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/types.js";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { fetchDonViTinhList } from "#src/api/danhmuc/donvitinh/index.js";
import { fetchLoaiThietBiList } from "#src/api/danhmuc/loaithietbi/index.js";
import { fetchThietBiList } from "#src/api/danhmuc/thietbi/index.js";
import {
	fetchAddChiTietPhieuNhapItem,
	fetchChiTietPhieuNhapList,
	fetchDeleteChiTietPhieuNhapItem,
	fetchDeleteMultipleChiTietPhieuNhapItems,
	fetchUpdateChiTietPhieuNhapItem,
} from "#src/api/nhapxuat/chitietphieunhap/index.js";
import { fetchPhieuNhapList } from "#src/api/nhapxuat/phieunhap/index";
import { BasicContent } from "#src/components/basic-content";
import ChiTietPhieuNhapModal from "./components/ChiTietPhieuNhapModal";
import ChiTietPhieuNhapTable from "./components/ChiTietPhieuNhapTable";
import ChiTietPhieuNhapToolBar from "./components/ChiTietPhieuNhapToolBar";

function ChiTietPhieuNhapPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<ChiTietPhieuNhapItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [filteredData, setFilteredData] = useState<ChiTietPhieuNhapItemType[]>([]);
	const [tableData, setTableData] = useState<ChiTietPhieuNhapItemType[]>([]);
	const [phieuNhapList, setPhieuNhapList] = useState<PhieuNhapItemType[]>([]);
	const [thietBiList, setThietBiList] = useState<ThietBiItemType[]>([]);
	const [loaiThietBiList, setLoaiThietBiList] = useState<LoaiThietBiItemType[]>(
		[],
	);
	const [donViTinhList, setDonViTinhList] = useState<DonViTinhItemType[]>([]);
	// Fetch danh sách đơn vị khi component được mount
	useEffect(() => {
		const fetchPhieuNhap = async () => {
			try {
				const result = await fetchPhieuNhapList();
				setPhieuNhapList(result);
				setTableData(result);
			}
			catch (error) {
				message.error(`Lỗi khi tải danh sách phiếu nhập: ${error}`);
			}
		};
		const fetchThietBi = async () => {
			try {
				const result = await fetchThietBiList();
				setThietBiList(result);
			}
			catch (error) {
				message.error(`Lỗi khi tải danh sách thiết bị: ${error}`);
			}
		};
		const fetchLoaiThietBi = async () => {
			try {
				const result = await fetchLoaiThietBiList();
				setLoaiThietBiList(result);
			}
			catch (error) {
				message.error(`Lỗi khi tải danh sách đơn vị: ${error}`);
			}
		};

		const fetchDonViTinh = async () => {
			try {
				const result = await fetchDonViTinhList();
				setDonViTinhList(result);
			}
			catch (error) {
				message.error(`Lỗi khi tải danh sách đơn vị tính: ${error}`);
			}
		};

		fetchLoaiThietBi();
		fetchPhieuNhap();
		fetchDonViTinh();
		fetchThietBi();
	}, []);

	const handleSubmit = async (values: any) => {
		try {
			if (editingRecord) {
				await fetchUpdateChiTietPhieuNhapItem(editingRecord.id, values);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddChiTietPhieuNhapItem(values);
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
			await fetchDeleteChiTietPhieuNhapItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMultipleChiTietPhieuNhapItems(
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
				<ChiTietPhieuNhapTable
					actionRef={actionRef}
					dataSource={tableData}
					loading={false}
					phieuNhapList={phieuNhapList}
					thietBiList={thietBiList}
					loaiThietBiList={loaiThietBiList}
					donViTinhList={donViTinhList}
					request={async (params: any) => {
						try {
							const result = await fetchChiTietPhieuNhapList();
							setTableData(result);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.phieu_nhap_id) {
								filtered = filtered.filter(
									item =>
										Number(item.phieu_nhap_id) === Number(params.phieu_nhap_id),
								);
							}
							setFilteredData(filtered);
							return {
								data: filtered,
								success: true,
								total: filtered.length,
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
						<ChiTietPhieuNhapToolBar
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

				<ChiTietPhieuNhapModal
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
					phieuNhapList={phieuNhapList}
					thietBiList={thietBiList}
					loaiThietBiList={loaiThietBiList}
					donViTinhList={donViTinhList}
				/>
			</BasicContent>
		</>
	);
}

export default ChiTietPhieuNhapPage;
