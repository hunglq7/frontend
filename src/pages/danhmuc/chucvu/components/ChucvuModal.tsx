import type { DanhMucChucVuItemType as ChucvuItem } from "#src/api/danhmuc/chucvu/types.js";
import {
	ModalForm,
	ProFormText,
} from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: ChucvuItem | null
}

function ChucvuModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật chức vụ"
					: "Thêm chức vụ"
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
				name="ten_chuc_vu"
				label="Tên chức vụ"
				placeholder="Nhập tên chức vụ"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập tên chức vụ",
					},
				]}
			/>
		</ModalForm>
	);
}

export default ChucvuModal;
