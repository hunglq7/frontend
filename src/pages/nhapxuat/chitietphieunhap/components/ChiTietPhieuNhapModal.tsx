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
	const findId = <T extends { id: number }>(
		id: number | undefined,
		label: string | undefined,
		items: T[],
		getLabel: (item: T) => string,
	) => {
		if (id != null) {
			return Number(id);
		}

		return items.find(item => getLabel(item) === label)?.id;
	};

	const normalizedInitialValues = initialValues
		? {
			...initialValues,
			phieu_nhap_id: findId(
				initialValues.phieu_nhap_id,
				initialValues.ma_phieu_nhap,
				phieuNhapList,
				phieuNhap => phieuNhap.ma_phieu_nhap,
			),
			thiet_bi_id: findId(
				initialValues.thiet_bi_id,
				initialValues.ten_thiet_bi,
				thietBiList,
				thietBi => thietBi.ten_thiet_bi,
			),
			loai_thiet_bi_id: findId(
				initialValues.loai_thiet_bi_id,
				initialValues.ten_loai,
				loaiThietBiList,
				loaiThietBi => loaiThietBi.ten_loai,
			),
			don_vi_tinh_id: findId(
				initialValues.don_vi_tinh_id,
				initialValues.ten_don_vi_tinh,
				donViTinhList,
				donViTinh => donViTinh.ten_don_vi_tinh,
			),
		}
		: {};

	return (
		<ModalForm
			key={initialValues?.id ?? "new"}
			title={
				initialValues
					? "Cập nhật chi tiết phiếu nhập"
					: "Thêm chi tiết phiếu nhập"
			}
			open={open}
			onOpenChange={onOpenChange}
			initialValues={normalizedInitialValues}
			modalProps={{
				destroyOnHidden: true,
			}}
			onFinish={onSubmit}
			layout="horizontal"
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
		>
			<ProFormSelect
				name="phieu_nhap_id"
				label="Phiếu nhập"
				placeholder="Chọn phiếu nhập"
				options={phieuNhapList.map(phieuNhap => ({
					label: phieuNhap.ma_phieu_nhap,
					value: Number(phieuNhap.id),
				}))}
				rules={[
					{
						required: true,
						message: "Vui lòng chọn phiếu nhập",
					},
				]}
			/>

			<ProFormSelect
				name="thiet_bi_id"
				label="Thiết bị"
				placeholder="Chọn thiết bị"
				options={thietBiList.map(thietBi => ({
					label: thietBi.ten_thiet_bi,
					value: Number(thietBi.id),
				}))}
				rules={[
					{
						required: true,
						message: "Vui lòng chọn thiết bị",
					},
				]}
			/>

			<ProFormSelect
				name="loai_thiet_bi_id"
				label="Loại thiết bị"
				placeholder="Chọn loại thiết bị"
				options={loaiThietBiList.map(loaiThietBi => ({
					label: loaiThietBi.ten_loai,
					value: Number(loaiThietBi.id),
				}))}
				rules={[
					{
						required: true,
						message: "Vui lòng chọn loại thiết bị",
					},
				]}
			/>

			<ProFormSelect
				name="don_vi_tinh_id"
				label="Đơn vị tính"
				placeholder="Chọn đơn vị tính"
				options={donViTinhList.map(donViTinh => ({
					label: donViTinh.ten_don_vi_tinh,
					value: Number(donViTinh.id),
				}))}
				rules={[
					{
						required: true,
						message: "Vui lòng chọn đơn vị tính",
					},
				]}
			/>
			<ProFormText
				name="so_luong"
				label="Số lượng"
				placeholder="Nhập số lượng"
			/>
			<ProFormMoney
				name="don_gia"
				label="Đơn giá"
				placeholder="Nhập đơn giá"
				fieldProps={{
					style: {
						width: "100%",
					},
				}}
			/>
		</ModalForm>
	);
}

export default ChiTietPhieuNhapModal;
