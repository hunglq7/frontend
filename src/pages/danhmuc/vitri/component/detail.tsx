import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import { BasicButton } from "#src/components/basic-button";
import { FORM_REQUIRED } from "#src/constants/rules";

import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	open: boolean
	setOpen: (open: boolean) => void
	title: string
	detailData: Partial<ViTriLapDatItemType>
	onFinish: (values: ViTriLapDatItemType) => Promise<void>
}

export function Detail({ open, setOpen, title, detailData, onFinish }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	useEffect(() => {
		if (open) {
			form.setFieldsValue(detailData);
		}
	}, [open, detailData, form]);

	const handleFinish = async (values: ViTriLapDatItemType) => {
		await onFinish(values);
		form.resetFields();
		setOpen(false);
	};

	const handleCancel = () => {
		form.resetFields();
		setOpen(false);
	};

	return (
		<Modal
			title={title}
			open={open}
			onCancel={handleCancel}
			footer={null}
			width={600}

		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleFinish}
				initialValues={detailData}
			>
				<Form.Item
					label={t("danhmuc.tenViTri")}
					name="ten_vi_tri"
					rules={FORM_REQUIRED}
				>
					<Input placeholder={t("danhmuc.tenViTriPlaceholder")} />
				</Form.Item>

				<Form.Item
					label={t("danhmuc.moTa")}
					name="mo_ta"
				>
					<Input.TextArea placeholder={t("danhmuc.moTaPlaceholder")} rows={3} />
				</Form.Item>

				<div className="flex justify-end gap-2">
					<BasicButton onClick={handleCancel}>
						{t("common.cancel")}
					</BasicButton>
					<BasicButton type="primary" htmlType="submit">
						{t("common.save")}
					</BasicButton>
				</div>
			</Form>
		</Modal>
	);
}
