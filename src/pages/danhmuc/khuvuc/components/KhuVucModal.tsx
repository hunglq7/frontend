import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types.js";
import {
	ModalForm,
	ProFormText,
} from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: KhuVucItemType | null
}

function KhuVucModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật khu vực"
					: "Thêm khu vực"
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
				name="ten_khu_vuc"
				label="Tên khu vực"
				placeholder="Nhập tên khu vực"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập tên khu vực",
					},
				]}
			/>
		</ModalForm>
	);
}

export default KhuVucModal;
