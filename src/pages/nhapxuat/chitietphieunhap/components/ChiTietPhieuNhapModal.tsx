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
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật chi tiết phiếu nhập"
					: "Thêm chi tiết phiếu nhập"
			}
			open={open}
			onOpenChange={onOpenChange}
			initialValues={initialValues || {}}
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
				rules={[
					{
						required: true,
						message: "Vui lòng chọn phiếu nhập",
					},
				]}
				request={async () => {
					// Simulate an API call to fetch suppliers
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(
								phieuNhapList.map(phieuNhap => ({
									label: phieuNhap.ma_phieu_nhap,
									value: phieuNhap.id,
								})),
							);
						}, 1000);
					});
				}}
			/>

			<ProFormSelect
				name="thiet_bi_id"
				label="Thiết bị"
				placeholder="Chọn thiết bị"
				rules={[
					{
						required: true,
						message: "Vui lòng chọn thiết bị",
					},
				]}
				request={async () => {
					// Simulate an API call to fetch suppliers
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(
								thietBiList.map(thietBi => ({
									label: thietBi.ten_thiet_bi,
									value: thietBi.id,
								})),
							);
						}, 1000);
					});
				}}
			/>

			<ProFormSelect
				name="loai_thiet_bi_id"
				label="Loại thiết bị"
				placeholder="Chọn loại thiết bị"
				rules={[
					{
						required: true,
						message: "Vui lòng chọn loại thiết bị",
					},
				]}
				request={async () => {
					// Simulate an API call to fetch suppliers
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(
								loaiThietBiList.map(loaiThietBi => ({
									label: loaiThietBi.ten_loai,
									value: loaiThietBi.id,
								})),
							);
						}, 1000);
					});
				}}
			/>

			<ProFormSelect
				name="don_vi_tinh_id"
				label="Đơn vị tính"
				placeholder="Chọn đơn vị tính"
				rules={[
					{
						required: true,
						message: "Vui lòng chọn đơn vị tính",
					},
				]}
				request={async () => {
					// Simulate an API call to fetch suppliers
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(
								donViTinhList.map(donViTinh => ({
									label: donViTinh.ten_don_vi_tinh,
									value: donViTinh.id,
								})),
							);
						}, 1000);
					});
				}}
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
