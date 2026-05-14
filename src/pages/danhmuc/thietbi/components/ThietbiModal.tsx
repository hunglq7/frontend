import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types.js";
import {
	ModalForm,
	ProFormText,
} from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: ThietBiItemType | null
}

function ThietBiModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật thiết bị"
					: "Thêm thiết bị"
			}
			open={open}
			onOpenChange={onOpenChange}
			initialValues={initialValues || {}}
			modalProps={{
				destroyOnHidden: true,
			}}
			onFinish={onSubmit}
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
		</ModalForm>
	);
}

export default ThietBiModal;
