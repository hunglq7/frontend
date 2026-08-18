import type { DanhMucCapDienThoaiItemType } from "#src/api/capthongtin/danhmuc/index.js";
import {
	ModalForm,
	ProFormText,
} from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: DanhMucCapDienThoaiItemType | null
}

function CapdienthoaiModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật cáp"
					: "Thêm cáp"
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
				name="tenCap"
				label="Tên cáp"
				placeholder="Nhập tên cáp"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập tên cáp",
					},
				]}
			/>
		</ModalForm>
	);
}

export default CapdienthoaiModal;
