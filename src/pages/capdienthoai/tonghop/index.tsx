/* cspell:disable */
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types";
import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import type { ActionType } from "@ant-design/pro-components";
import {
	fetchAddTonghopThietbiThongtin,
	fetchDeleteMultipleTonghopThietbiThongtinItems,
	fetchDeleteTonghopThietbiThongtinItem,
	fetchTonghopThietbiThongtinList,
	fetchUpdateTonghopThietbiThongtin,
} from "#src/api/capthongtin/tonghop/index.js";
import { fetchDanhMucDonViList } from "#src/api/danhmuc/donvi/index";
import { fetchDonViTinhList } from "#src/api/danhmuc/donvitinh/index";
import { fetchKhuVucList } from "#src/api/danhmuc/khuvuc/index";
import { fetchLoaiThietBiList } from "#src/api/danhmuc/loaithietbi/index";
import { fetchThietBiList } from "#src/api/danhmuc/thietbi/index";
import { fetchViTriLapDatList } from "#src/api/danhmuc/vitri/index";
import { BasicContent } from "#src/components/basic-content";
import { message } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useRef, useState } from "react";
import TonghopThietbiThongtinModel from "./components/TonghopThietbiThongtinModel";
import TonghopThietbiThongtinTable from "./components/TonghopThietbiThongtinTable";
import TonghopThietbiThongtinToolBar from "./components/TonghopThietbiThongtinToolBar";

dayjs.extend(customParseFormat);

function TonghopThietbiThongtinPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord]
		= useState<TonghopThietbiThongtinItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [filteredData, setFilteredData] = useState<TonghopThietbiThongtinItemType[]>([]);
	const [danhMucDonViList, setDanhMucDonViList] = useState<DanhMucDonViItemType[]>([]);
	const [thietBiList, setThietBiList] = useState<ThietBiItemType[]>([]);
	const [viTriList, setViTriList] = useState<ViTriLapDatItemType[]>([]);
	const [loaiThietBiList, setLoaiThietBiList] = useState<LoaiThietBiItemType[]>(
		[],
	);
	const [donViTinhList, setDonViTinhList] = useState<DonViTinhItemType[]>([]);
	const [khuVucList, setKhuVucList] = useState<KhuVucItemType[]>([]);
	const getDetailId = (record: TonghopThietbiThongtinItemType) =>
		record.id ?? record.thiet_bi_id;
	// Fetch danh sách đơn vị khi component được mount
	useEffect(() => {
		const loadTonghopThietbiThongtinList = async () => {
			try {
				const result = await fetchTonghopThietbiThongtinList();
				setFilteredData(result);
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
		const fetchViTri = async () => {
			try {
				const result = await fetchViTriLapDatList();
				setViTriList(result);
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách vị trí:", error);
				message.error(`Lỗi khi tải danh sách vị trí: ${error}`);
			}
		};
		const fetchKhuVuc = async () => {
			try {
				const result = await fetchKhuVucList();
				setKhuVucList(result);
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách khu vực:", error);
				message.error(`Lỗi khi tải danh sách khu vực: ${error}`);
			}
		};

		fetchKhuVuc();
		fetchViTri();
		fetchLoaiThietBi();
		fetchDanhMucDonVi();
		loadTonghopThietbiThongtinList();
		fetchDonViTinh();
		fetchThietBi();
	}, []);

	const handleSubmit = async (values: any) => {
		const rawDate = values.ngay_lap;
		const parsedDate = dayjs.isDayjs(rawDate)
			? rawDate
			: typeof rawDate === "string"
				? dayjs(rawDate, ["YYYY-MM-DD", "DD/MM/YYYY"], true)
				: dayjs(rawDate);
		const payload = {
			...values,
			ngay_lap: rawDate && parsedDate.isValid()
				? parsedDate.format("YYYY-MM-DD")
				: undefined,
		};

		try {
			if (editingRecord) {
				const id = getDetailId(editingRecord);
				if (id == null) {
					throw new Error("Bản ghi chi tiết phiếu nhập không có ID");
				}
				await fetchUpdateTonghopThietbiThongtin(id, payload);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddTonghopThietbiThongtin(payload);
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
					viTriList={viTriList}
					KhuVucList={khuVucList}
					request={async (params: any) => {
						try {
							const result = await fetchTonghopThietbiThongtinList();
							const filterFields = [
								"ten_thiet_bi",
								"ten_don_vi",
								"ten_vi_tri",
								"ten_khu_vuc",
								"ten_loai",
								"ten_don_vi_tinh",
							] as const;
							const filtered = result.filter((item) => {
								return filterFields.every((field) => {
									const selectedValue = params[field];
									if (selectedValue === undefined || selectedValue === null || selectedValue === "") {
										return true;
									}
									return String(item[field]) === String(selectedValue);
								});
							});
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
					viTriList={viTriList}
					KhuVucList={khuVucList}
				/>
			</BasicContent>
		</>
	);
}

export default TonghopThietbiThongtinPage;
