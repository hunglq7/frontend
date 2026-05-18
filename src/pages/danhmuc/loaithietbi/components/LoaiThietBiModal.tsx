import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import {
	ModalForm,
	ProFormText,
} from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: LoaiThietBiItemType | null
}

function LoaiThietBiModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật loại thiết bị"
					: "Thêm loại thiết bị"
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
				name="ten_loai"
				label="Tên loại thiết bị"
				placeholder="Nhập tên loại thiết bị"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập tên loại thiết bị",
					},
				]}
			/>
		</ModalForm>
	);
}

export default LoaiThietBiModal;
