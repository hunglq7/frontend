import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types.js";
import type { ChiTietPhieuNhapItemType } from "#src/api/nhapxuat/chitietphieunhap/types.js";
import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/types.js";
import {
	ModalForm,
	ProFormMoney,
	ProFormSelect,
	ProFormText,
} from "@ant-design/pro-components";

interface SelectItem { id: number }

function getOptions<T extends SelectItem>(
	items: T[],
	getLabel: (item: T) => string,
) {
	return items.map(item => ({
		label: getLabel(item),
		value: Number(item.id),
	}));
}

function resolveId<T extends SelectItem>(
	id: number | undefined,
	label: string | undefined,
	items: T[],
	getLabel: (item: T) => string,
) {
	return id != null
		? Number(id)
		: items.find(item => getLabel(item) === label)?.id;
}

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: ChiTietPhieuNhapItemType | null
	phieuNhapList: PhieuNhapItemType[]
	thietBiList: ThietBiItemType[]
	loaiThietBiList: LoaiThietBiItemType[]
	donViTinhList: DonViTinhItemType[]
}

function ChiTietPhieuNhapModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
	phieuNhapList,
	loaiThietBiList,
	thietBiList,
	donViTinhList,
}: Props) {
	const normalizedInitialValues = initialValues
		? {
			...initialValues,
			phieu_nhap_id: resolveId(
				initialValues.phieu_nhap_id,
				initialValues.ma_phieu_nhap,
				phieuNhapList,
				phieuNhap => phieuNhap.ma_phieu_nhap,
			),
			thiet_bi_id: resolveId(
				initialValues.thiet_bi_id,
				initialValues.ten_thiet_bi,
				thietBiList,
				thietBi => thietBi.ten_thiet_bi,
			),
			loai_thiet_bi_id: resolveId(
				initialValues.loai_thiet_bi_id,
				initialValues.ten_loai,
				loaiThietBiList,
				loaiThietBi => loaiThietBi.ten_loai,
			),
			don_vi_tinh_id: resolveId(
				initialValues.don_vi_tinh_id,
				initialValues.ten_don_vi_tinh,
				donViTinhList,
				donViTinh => donViTinh.ten_don_vi_tinh,
			),
		}
		: {};

	const selectFields = [
		{
			name: "phieu_nhap_id",
			label: "Phiếu nhập",
			placeholder: "Chọn phiếu nhập",
			message: "Vui lòng chọn phiếu nhập",
			options: getOptions(phieuNhapList, item => item.ma_phieu_nhap),
		},
		{
			name: "thiet_bi_id",
			label: "Thiết bị",
			placeholder: "Chọn thiết bị",
			message: "Vui lòng chọn thiết bị",
			options: getOptions(thietBiList, item => item.ten_thiet_bi),
		},
		{
			name: "loai_thiet_bi_id",
			label: "Loại thiết bị",
			placeholder: "Chọn loại thiết bị",
			message: "Vui lòng chọn loại thiết bị",
			options: getOptions(loaiThietBiList, item => item.ten_loai),
		},
		{
			name: "don_vi_tinh_id",
			label: "Đơn vị tính",
			placeholder: "Chọn đơn vị tính",
			message: "Vui lòng chọn đơn vị tính",
			options: getOptions(donViTinhList, item => item.ten_don_vi_tinh),
		},
	] as const;

	return (
		<ModalForm
			key={initialValues?.id ?? "new"}
			title={initialValues ? "Cập nhật chi tiết phiếu nhập" : "Thêm chi tiết phiếu nhập"}
			open={open}
			onOpenChange={onOpenChange}
			initialValues={normalizedInitialValues}
			modalProps={{ destroyOnHidden: true }}
			onFinish={onSubmit}
			layout="horizontal"
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
		>
			{selectFields.map(field => (
				<ProFormSelect
					key={field.name}
					name={field.name}
					label={field.label}
					placeholder={field.placeholder}
					options={field.options}
					rules={[{ required: true, message: field.message }]}
				/>
			))}
			<ProFormText
				name="so_luong"
				label="Số lượng"
				placeholder="Nhập số lượng"
			/>
			<ProFormMoney
				name="don_gia"
				label="Đơn giá"
				placeholder="Nhập đơn giá"
				fieldProps={{ style: { width: "100%" } }}
			/>
		</ModalForm>
	);
}

export default ChiTietPhieuNhapModal;
