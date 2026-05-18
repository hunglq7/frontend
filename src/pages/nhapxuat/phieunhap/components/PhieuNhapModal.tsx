import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types.js";
import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/types.js";
import {
	ModalForm,
	ProFormDatePicker,
	ProFormSelect,
	ProFormText,
} from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: PhieuNhapItemType | null
	donViList: DanhMucDonViItemType[]
}

function PhieuNhapModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
	donViList,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật phiếu nhập"
					: "Thêm phiếu nhập"
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
			<ProFormText
				name="ma_phieu_nhap"
				label="Mã phiếu nhập"
				placeholder="Nhập mã phiếu nhập"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập mã phiếu nhập",
					},
				]}
			/>
			<ProFormDatePicker
				name="ngay_nhap"
				label="Ngày nhập"
				placeholder="Chọn ngày nhập"
				rules={[
					{
						required: true,
						message: "Vui lòng chọn ngày nhập",
					},
				]}
			/>
			<ProFormSelect
				name="don_vi_id"
				label="Đơn vị"
				placeholder="Chọn đơn vị"
				rules={[
					{
						required: true,
						message: "Vui lòng chọn đơn vị",
					},
				]}
				request={async () => {
					// Simulate an API call to fetch suppliers
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(
								donViList.map(donVi => ({
									label: donVi.ten_don_vi,
									value: donVi.id,
								})),
							);
						}, 1000);
					});
				}}
			/>
			<ProFormText
				name="nguoi_nhap"
				label="Người nhập"
				placeholder="Nhập người nhập"
			/>

			<ProFormText
				name="ghi_chu"
				label="Ghi chú"
				placeholder="Nhập ghi chú"

			/>
		</ModalForm>
	);
}

export default PhieuNhapModal;
