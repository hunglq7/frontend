/* cspell:disable */
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types.js";
import type { ActionType } from "@ant-design/pro-components";
import {
	fetchAddTonghopThietbiThongtin,
	fetchDeleteMultipleTonghopThietbiThongtinItems,
	fetchDeleteTonghopThietbiThongtinItem,
	fetchTonghopThietbiThongtinList,
	fetchUpdateTonghopThietbiThongtin,
} from "#src/api/capthongtin/tonghop/index.js";
import { fetchDanhMucDonViList } from "#src/api/danhmuc/donvi/index";
import { fetchDonViTinhList } from "#src/api/danhmuc/donvitinh/index.js";
import { fetchLoaiThietBiList } from "#src/api/danhmuc/loaithietbi/index.js";
import { fetchThietBiList } from "#src/api/danhmuc/thietbi/index.js";
import { BasicContent } from "#src/components/basic-content";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import TonghopThietbiThongtinModel from "./components/TonghopThietbiThongtinModel";
import TonghopThietbiThongtinTable from "./components/TonghopThietbiThongtinTable";
import TonghopThietbiThongtinToolBar from "./components/TonghopThietbiThongtinToolBar";

function TonghopThietbiThongtinPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<TonghopThietbiThongtinItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [filteredData, setFilteredData] = useState<TonghopThietbiThongtinItemType[]>([]);
	const [danhMucDonViList, setDanhMucDonViList] = useState<DanhMucDonViItemType[]>([]);
	const [thietBiList, setThietBiList] = useState<ThietBiItemType[]>([]);
	const [loaiThietBiList, setLoaiThietBiList] = useState<LoaiThietBiItemType[]>(
		[],
	);
	const [donViTinhList, setDonViTinhList] = useState<DonViTinhItemType[]>([]);
	const getDetailId = (record: TonghopThietbiThongtinItemType) =>
		record.id ?? record.thiet_bi_id;
	const normalizeDetail = (record: TonghopThietbiThongtinItemType) => ({
		...record,
		id: getDetailId(record),
	});
	// Fetch danh sách đơn vị khi component được mount
	useEffect(() => {
		const loadTonghopThietbiThongtinList = async () => {
			try {
				const result = await fetchTonghopThietbiThongtinList();
				setFilteredData(result.map(normalizeDetail));
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách tổng hợp thiết bị thông tin:", error);
				message.error(`Lỗi khi tải danh sách tổng hợp thiết bị thông tin: ${error}`);
			}
		};
		const fetchThietBi = async () => {
			try {
				const result = await fetchThietBiList();
				setThietBiList(result);
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách thiết bị:", error);
				message.error(`Lỗi khi tải danh sách thiết bị: ${error}`);
			}
		};
		const fetchDanhMucDonVi = async () => {
			try {
				const result = await fetchDanhMucDonViList();
				setDanhMucDonViList(result);
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách danh mục đơn vị:", error);
				message.error(`Lỗi khi tải danh sách danh mục đơn vị: ${error}`);
			}
		};
		const fetchLoaiThietBi = async () => {
			try {
				const result = await fetchLoaiThietBiList();
				setLoaiThietBiList(result);
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách loại thiết bị:", error);
				message.error(`Lỗi khi tải danh sách loại thiết bị: ${error}`);
			}
		};

		const fetchDonViTinh = async () => {
			try {
				const result = await fetchDonViTinhList();
				setDonViTinhList(result);
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách đơn vị tính:", error);
				message.error(`Lỗi khi tải danh sách đơn vị tính: ${error}`);
			}
		};

		fetchLoaiThietBi();
		fetchDanhMucDonVi();
		loadTonghopThietbiThongtinList();
		fetchDonViTinh();
		fetchThietBi();
	}, []);

	const handleSubmit = async (values: any) => {
		try {
			if (editingRecord) {
				const id = getDetailId(editingRecord);
				if (id == null) {
					throw new Error("Bản ghi chi tiết phiếu nhập không có ID");
				}
				await fetchUpdateTonghopThietbiThongtin(id, values);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddTonghopThietbiThongtin(values);
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

	const handleDelete = async (id: number | undefined) => {
		try {
			if (id == null) {
				throw new Error("Bản ghi chi tiết phiếu nhập không có ID");
			}
			await fetchDeleteTonghopThietbiThongtinItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		try {
			await fetchDeleteMultipleTonghopThietbiThongtinItems(
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
				<TonghopThietbiThongtinTable
					actionRef={actionRef}
					loading={false}
					thietBiList={thietBiList}
					loaiThietBiList={loaiThietBiList}
					donViTinhList={donViTinhList}
					danhMucDonViList={danhMucDonViList}
					request={async (params: any) => {
						try {
							const result = (await fetchTonghopThietbiThongtinList()).map(
								normalizeDetail,
							);
							// Filter dữ liệu dựa trên tham số tìm kiếm
							let filtered = result;
							if (params.thiet_bi_id) {
								filtered = filtered.filter(
									item =>
										Number(item.thiet_bi_id) === Number(params.thiet_bi_id),
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
						<TonghopThietbiThongtinToolBar
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

				<TonghopThietbiThongtinModel
					open={openModal}
					onOpenChange={setOpenModal}
					onSubmit={handleSubmit}
					initialValues={editingRecord}
					thietBiList={thietBiList}
					loaiThietBiList={loaiThietBiList}
					donViTinhList={donViTinhList}
					danhMucDonViList={danhMucDonViList}
				/>
			</BasicContent>
		</>
	);
}

export default TonghopThietbiThongtinPage;
