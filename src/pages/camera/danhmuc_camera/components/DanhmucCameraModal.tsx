import type { DanhMucCameraItemType } from "#src/api/camera/danhmuc_camera/types.js";
import { ModalForm, ProFormText } from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: DanhMucCameraItemType | null
}

function DanhMucCameraModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
}: Props) {
	return (
		<ModalForm
			title={initialValues ? "Cập nhật thiết bị" : "Thêm thiết bị"}
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
				name="ten_thiet_bi"
				label="Tên thiết bị"
				placeholder="Nhập tên thiết bị"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập tên thiết bị",
					},
				]}
			/>
			<ProFormText
				name="thong_so_ky_thuat"
				label="Thông số kỹ thuật"
				placeholder="Nhập thông số kỹ thuật"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập thông số kỹ thuật",
					},
				]}
			/>
			<ProFormText
				name="hang_san_xuat"
				label="Hãng sản xuất"
				placeholder="Nhập hãng sản xuất"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập hãng sản xuất",
					},
				]}
			/>
			<ProFormText
				name="nuoc_san_xuat"
				label="Nước sản xuất"
				placeholder="Nhập nước sản xuất"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập nước sản xuất",
					},
				]}
			/>
		</ModalForm>
	);
}

export default DanhMucCameraModal;
