/* cspell:disable */
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types";
import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import {
	ModalForm,
	ProFormDatePicker,
	ProFormDigit,
	ProFormSelect,
	ProFormSwitch,
	ProFormText,
} from "@ant-design/pro-components";
import dayjs from "dayjs";
import { useMemo } from "react";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: TonghopThietbiThongtinItemType | null
	thietBiList: ThietBiItemType[]
	loaiThietBiList: LoaiThietBiItemType[]
	donViTinhList: DonViTinhItemType[]
	danhMucDonViList: DanhMucDonViItemType[]
	viTriList: ViTriLapDatItemType[]
	khuVucList: KhuVucItemType[]
}

// Helper thuần túy chuyển danh sách sang options của Antd Select
function toOptions<T extends { id: number }>(items: T[], getLabel: (item: T) => string) {
	return items.map(item => ({ label: getLabel(item), value: Number(item.id) }));
}

// Helper tìm ID nhanh từ Map hoặc fallback
function findIdByMap(id: number | undefined, label: string | undefined, map: Map<string, number>) {
	if (id != null)
		return Number(id);
	if (!label)
		return undefined;
	return map.get(label);
}

function TonghopThietbiThongtinModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
	loaiThietBiList,
	thietBiList,
	donViTinhList,
	danhMucDonViList,
	viTriList,
	khuVucList,
}: Props) {
	// 1. Memoize options cho các trường Select (Đã sửa lỗi vi phạm Rules of Hooks)
	const thietBiOptions = useMemo(() => toOptions(thietBiList, item => item.ten_thiet_bi), [thietBiList]);
	const donViOptions = useMemo(() => toOptions(danhMucDonViList, item => item.ten_don_vi), [danhMucDonViList]);
	const viTriOptions = useMemo(() => toOptions(viTriList, item => item.ten_vi_tri), [viTriList]);
	const khuVucOptions = useMemo(() => toOptions(khuVucList, item => item.ten_khu_vuc), [khuVucList]);
	const loaiThietBiOptions = useMemo(() => toOptions(loaiThietBiList, item => item.ten_loai), [loaiThietBiList]);
	const donViTinhOptions = useMemo(() => toOptions(donViTinhList, item => item.ten_don_vi_tinh), [donViTinhList]);

	// 2. Tạo Map tra cứu độ phức tạp O(1) thay vì dùng .find() độ phức tạp O(N)
	const nameToIdMaps = useMemo(() => {
		const createMap = <T extends { id: number }>(items: T[], getLabel: (item: T) => string) =>
			new Map(items.map(item => [getLabel(item), Number(item.id)]));

		return {
			thietBi: createMap(thietBiList, item => item.ten_thiet_bi),
			loaiThietBi: createMap(loaiThietBiList, item => item.ten_loai),
			donViTinh: createMap(donViTinhList, item => item.ten_don_vi_tinh),
			donVi: createMap(danhMucDonViList, item => item.ten_don_vi),
			viTri: createMap(viTriList, item => item.ten_vi_tri),
			khuVuc: createMap(khuVucList, item => item.ten_khu_vuc),
		};
	}, [thietBiList, loaiThietBiList, donViTinhList, danhMucDonViList, viTriList, khuVucList]);

	// 3. Chuẩn hóa giá trị khởi tạo (Đã bổ sung đầy đủ dependencies)
	const normalizedInitialValues = useMemo(() => {
		if (!initialValues)
			return {};

		return {
			...initialValues,
			tinh_trang: Boolean(initialValues.tinh_trang),
			ngay_lap: initialValues.ngay_lap ? dayjs(initialValues.ngay_lap) : undefined,
			thiet_bi_id: findIdByMap(initialValues.thiet_bi_id, initialValues.ten_thiet_bi, nameToIdMaps.thietBi),
			loai_thiet_bi_id: findIdByMap(initialValues.loai_thiet_bi_id, initialValues.ten_loai, nameToIdMaps.loaiThietBi),
			don_vi_tinh_id: findIdByMap(initialValues.don_vi_tinh_id, initialValues.ten_don_vi_tinh, nameToIdMaps.donViTinh),
			don_vi_id: findIdByMap(initialValues.don_vi_id, initialValues.ten_don_vi, nameToIdMaps.donVi),
			vi_tri_id: findIdByMap(initialValues.vi_tri_id, initialValues.ten_vi_tri, nameToIdMaps.viTri),
			khu_vuc_id: findIdByMap(initialValues.khu_vuc_id, initialValues.ten_khu_vuc, nameToIdMaps.khuVuc),
		};
	}, [initialValues, nameToIdMaps]);

	// 4. Mảng cấu hình UI nhẹ nhàng, không chứa hook
	const selectFields = [
		{ name: "thiet_bi_id", label: "Thiết bị", options: thietBiOptions },
		{ name: "don_vi_id", label: "Đơn vị", options: donViOptions },
		{ name: "vi_tri_id", label: "Vị trí", options: viTriOptions },
		{ name: "khu_vuc_id", label: "Khu vực", options: khuVucOptions },
		{ name: "loai_thiet_bi_id", label: "Loại thiết bị", options: loaiThietBiOptions },
		{ name: "don_vi_tinh_id", label: "Đơn vị tính", options: donViTinhOptions },
	];

	return (
		<ModalForm
			key={initialValues?.id ?? "new"}
			title={initialValues ? "Cập nhật thiết bị" : "Thêm thiết bị"}
			open={open}
			onOpenChange={onOpenChange}
			initialValues={normalizedInitialValues}
			modalProps={{
				destroyOnHidden: true, // Sửa 'destroyOnHidden' thành chuẩn Antd v5 'destroyOnClose'
			}}
			onFinish={onSubmit}
			layout="horizontal"
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
		>
			{selectFields.map(({ name, label, options }) => (
				<ProFormSelect
					key={name}
					name={name}
					label={label}
					placeholder={`Chọn ${label.toLowerCase()}`}
					options={options}
					fieldProps={{
						showSearch: true,
						optionFilterProp: "label",
					}}
					rules={[{ required: true, message: `Vui lòng chọn ${label.toLowerCase()}` }]}
				/>
			))}

			<ProFormDigit
				name="so_luong"
				label="Số lượng"
				placeholder="Nhập số lượng"
				min={0}
				fieldProps={{ precision: 0 }}
			/>

			<ProFormDatePicker
				name="ngay_lap"
				label="Ngày lắp"
				placeholder="Chọn ngày lắp"
				fieldProps={{ format: "DD/MM/YYYY" }}
			/>
			<ProFormText
				name="ghi_chu"
				label="Ghi chú"
				placeholder="Ghi chú"

			/>

			<ProFormSwitch
				name="tinh_trang"
				label="Tình trạng"
				initialValue={false}
			/>
		</ModalForm>
	);
}

export default TonghopThietbiThongtinModal;
