import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import {
	ModalForm,
	ProFormText,
} from "@ant-design/pro-components";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: ViTriLapDatItemType | null
}

function VitriModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
}: Props) {
	return (
		<ModalForm
			title={
				initialValues
					? "Cập nhật vị trí lắp đặt"
					: "Thêm vị trí lắp đặt"
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
				name="ten_vi_tri"
				label="Vị trí lắp đặt"
				placeholder="Nhập vị trí lắp đặt"
				rules={[
					{
						required: true,
						message: "Vui lòng nhập vị trí",
					},
				]}
			/>
			<ProFormText
				name="mo_ta"
				label="mổ tả"
				placeholder="Nhập mô tả"
			/>
		</ModalForm>
	);
}

export default VitriModal;
