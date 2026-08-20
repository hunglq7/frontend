import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import {
	ModalForm,
	ProFormText,
} from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: DonViTinhItemType | null
}

function DonViTinhModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật đơn vị tính"
					: "Thêm đơn vị tính"
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
				name="ten_don_vi_tinh"
				label="Tên đơn vị tính"
				placeholder="Nhập tên đơn vị tính"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập tên đơn vị tính",
					},
				]}
			/>
		</ModalForm>
	);
}

export default DonViTinhModal;
