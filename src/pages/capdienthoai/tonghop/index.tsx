/* cspell:disable */
import type { TonghopThietbiThongtinItemType, TonghopThietbiThongtinPayload } from "#src/api/capthongtin/tonghop/types";
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
import { useCallback, useEffect, useRef, useState } from "react";
import TonghopThietbiThongtinModel from "./components/TonghopThietbiThongtinModel";
import TonghopThietbiThongtinTable from "./components/TonghopThietbiThongtinTable";
import TonghopThietbiThongtinToolBar from "./components/TonghopThietbiThongtinToolBar";

dayjs.extend(customParseFormat);

function formatNgayLap(value: unknown) {
	if (!value)
		return undefined;
	const date = dayjs.isDayjs(value)
		? value
		: value instanceof Date
			? dayjs(value)
			: typeof value === "string"
				? dayjs(value, ["YYYY-MM-DD", "DD/MM/YYYY", "YYYY-MM-DDTHH:mm:ss.SSSZ"], true)
				: dayjs(value as dayjs.ConfigType);
	return date.isValid() ? date.format("YYYY-MM-DD") : undefined;
}

const FILTER_FIELDS = [
	"ten_thiet_bi",
	"ten_don_vi",
	"ten_vi_tri",
	"ten_khu_vuc",
	"ten_loai",
	"ten_don_vi_tinh",
] as const;

function TonghopThietbiThongtinPage() {
	const actionRef = useRef<ActionType>(null);
	const [openModal, setOpenModal] = useState(false);
	const [editingRecord, setEditingRecord] = useState<TonghopThietbiThongtinItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [tableData, setTableData] = useState<TonghopThietbiThongtinItemType[]>([]);

	// State quản lý danh mục dạng gộp
	const [categories, setCategories] = useState<{
		thietBi: ThietBiItemType[]
		loaiThietBi: LoaiThietBiItemType[]
		donViTinh: DonViTinhItemType[]
		danhMucDonVi: DanhMucDonViItemType[]
		viTri: ViTriLapDatItemType[]
		khuVuc: KhuVucItemType[]
	}>({
		thietBi: [],
		loaiThietBi: [],
		donViTinh: [],
		danhMucDonVi: [],
		viTri: [],
		khuVuc: [],
	});

	const getDetailId = (record: TonghopThietbiThongtinItemType) => record.id ?? record.thiet_bi_id;

	// 1. Fetch song song (Parallel Fetching) toàn bộ danh mục khi mount bằng Promise.allSettled
	useEffect(() => {
		const fetchAllCategories = async () => {
			try {
				const [
					thietBiRes,
					loaiThietBiRes,
					donViTinhRes,
					danhMucDonViRes,
					viTriRes,
					khuVucRes,
				] = await Promise.all([
					fetchThietBiList(),
					fetchLoaiThietBiList(),
					fetchDonViTinhList(),
					fetchDanhMucDonViList(),
					fetchViTriLapDatList(),
					fetchKhuVucList(),
				]);

				setCategories({
					thietBi: thietBiRes,
					loaiThietBi: loaiThietBiRes,
					donViTinh: donViTinhRes,
					danhMucDonVi: danhMucDonViRes,
					viTri: viTriRes,
					khuVuc: khuVucRes,
				});
			}
			catch (error) {
				console.error("Lỗi khi tải danh mục:", error);
				message.error("Lỗi khi tải danh sách các danh mục hệ thống");
			}
		};

		fetchAllCategories();
	}, []);

	// 2. Tối ưu request data của ProTable
	const handleTableRequest = useCallback(async (params: Record<string, any>) => {
		try {
			const result = await fetchTonghopThietbiThongtinList();

			const filtered = result.filter(item =>
				FILTER_FIELDS.every((field) => {
					const selectedValue = params[field];
					if (selectedValue == null || selectedValue === "")
						return true;
					return String(item[field]) === String(selectedValue);
				}),
			);

			setTableData(filtered); // Lưu cache cho Toolbar nếu cần xuất Excel/báo cáo

			return {
				data: filtered,
				success: true,
				total: filtered.length,
			};
		}
		catch (error) {
			console.error("Error fetching data:", error);
			return { data: [], success: false, total: 0 };
		}
	}, []);

	// 3. Tối ưu Submit Form
	const handleSubmit = async (values: any) => {
		const payload: TonghopThietbiThongtinPayload = {
			thiet_bi_id: Number(values.thiet_bi_id),
			don_vi_id: Number(values.don_vi_id),
			vi_tri_id: Number(values.vi_tri_id),
			khu_vuc_id: Number(values.khu_vuc_id),
			don_vi_tinh_id: Number(values.don_vi_tinh_id),
			loai_thiet_bi_id: Number(values.loai_thiet_bi_id),
			so_luong: Number(values.so_luong),
			tinh_trang: values.tinh_trang ? 1 : 0,
			ngay_lap: formatNgayLap(values.ngay_lap),
			ghi_chu: values.ghi_chu ?? null,
		};

		try {
			if (editingRecord) {
				const id = getDetailId(editingRecord);
				if (id == null)
					throw new Error("Bản ghi không có ID");
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
			message.error(`Thao tác thất bại: ${error}`);
			return false;
		}
	};

	const handleDelete = async (id: number | undefined) => {
		if (id == null) {
			message.error("Bản ghi không có ID");
			return;
		}
		try {
			await fetchDeleteTonghopThietbiThongtinItem(id);
			message.success("Xóa thành công");
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại: ${error}`);
		}
	};

	const handleDeleteMany = async () => {
		if (!selectedRowKeys.length)
			return;
		try {
			await fetchDeleteMultipleTonghopThietbiThongtinItems(selectedRowKeys as number[]);
			message.success("Xóa nhiều thành công");
			setSelectedRowKeys([]);
			actionRef.current?.reload();
		}
		catch (error) {
			message.error(`Xóa thất bại: ${error}`);
		}
	};

	return (
		<BasicContent>
			<TonghopThietbiThongtinTable
				actionRef={actionRef}
				thietBiList={categories.thietBi}
				loaiThietBiList={categories.loaiThietBi}
				donViTinhList={categories.donViTinh}
				danhMucDonViList={categories.danhMucDonVi}
				viTriList={categories.viTri}
				khuVucList={categories.khuVuc}
				request={handleTableRequest}
				onEdit={(record) => {
					setEditingRecord(record);
					setOpenModal(true);
				}}
				onDelete={handleDelete}
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
				}}
				toolbar={(
					<TonghopThietbiThongtinToolBar
						selectedRowKeys={selectedRowKeys}
						onAdd={() => {
							setEditingRecord(null);
							setOpenModal(true);
						}}
						onDeleteMany={handleDeleteMany}
						data={tableData}
					/>
				)}
			/>

			<TonghopThietbiThongtinModel
				open={openModal}
				onOpenChange={setOpenModal}
				onSubmit={handleSubmit}
				initialValues={editingRecord}
				thietBiList={categories.thietBi}
				loaiThietBiList={categories.loaiThietBi}
				donViTinhList={categories.donViTinh}
				danhMucDonViList={categories.danhMucDonVi}
				viTriList={categories.viTri}
				khuVucList={categories.khuVuc}
			/>
		</BasicContent>
	);
}

export default TonghopThietbiThongtinPage;
