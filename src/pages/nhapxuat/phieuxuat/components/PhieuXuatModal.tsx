import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types.js";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types.js";
import type { PhieuXuatItemType } from "#src/api/nhapxuat/phieuxuat/types.js";
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
	initialValues?: PhieuXuatItemType | null
	donViList: DanhMucDonViItemType[]
	viTriList: ViTriLapDatItemType[]
}

function PhieuXuatModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
	donViList,
	viTriList,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật phiếu xuất"
					: "Thêm phiếu xuất"
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
				name="ma_phieu_xuat"
				label="Mã phiếu xuất"
				placeholder="Nhập mã phiếu xuất"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập mã phiếu xuất",
					},
				]}
			/>
			<ProFormDatePicker
				name="ngay_xuat"
				label="Ngày xuất"
				placeholder="Chọn ngày xuất"
				rules={[
					{
						required: true,
						message: "Vui lòng chọn ngày xuất",
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

			<ProFormSelect
				name="vi_tri_id"
				label="Vị trí"
				placeholder="Chọn vị trí"
				rules={[
					{
						required: true,
						message: "Vui lòng chọn vị trí",
					},
				]}
				request={async () => {
					// Simulate an API call to fetch suppliers
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve(
								viTriList.map(viTri => ({
									label: viTri.ten_vi_tri,
									value: viTri.id,
								})),
							);
						}, 1000);
					});
				}}
			/>
			<ProFormText
				name="nguoi_xuat"
				label="Người xuất"
				placeholder="Nhập người xuất"
			/>

			<ProFormText
				name="ghi_chu"
				label="Ghi chú"
				placeholder="Nhập ghi chú"

			/>
		</ModalForm>
	);
}

export default PhieuXuatModal;
