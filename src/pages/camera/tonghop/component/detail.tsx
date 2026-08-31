import type { TonghopCameraItemType } from "#src/api/camera/tonghop/types";
import { BasicButton } from "#src/components/basic-button";
import { Form, Input, InputNumber, Modal } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	open: boolean
	setOpen: (open: boolean) => void
	title: string
	detailData: Partial<TonghopCameraItemType>
	onFinish: (values: TonghopCameraItemType) => Promise<void>
}

export function Detail({ open, setOpen, title, detailData, onFinish }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<TonghopCameraItemType>();

	useEffect(() => {
		if (open) {
			if (detailData.id) {
				form.setFieldsValue(detailData);
			}
			else {
				form.resetFields();
			}
		}
	}, [open, detailData, form]);

	const handleFinish = async (values: TonghopCameraItemType) => {
		await onFinish(values);
		form.resetFields();
		setOpen(false);
	};

	const handleCancel = () => {
		form.resetFields();
		setOpen(false);
	};

	return (
		<Modal title={title} open={open} onCancel={handleCancel} footer={null} width={640}>
			<Form form={form} layout="vertical" onFinish={handleFinish} initialValues={detailData}>
				<Form.Item
					label={t("camera.cameraId") || "Camera ID"}
					name="camera_id"
					rules={[{ required: true }]}
				>
					<InputNumber style={{ width: "100%" }} disabled={Boolean(detailData.id)} />
				</Form.Item>

				<Form.Item
					label={t("camera.totalScans") || "Total Scans"}
					name="total_scans"
					rules={[{ required: true }]}
				>
					<InputNumber style={{ width: "100%" }} min={0} />
				</Form.Item>

				<Form.Item label={t("camera.summary") || "Summary"} name="summary">
					<Input.TextArea rows={4} />
				</Form.Item>

				<div className="flex justify-end gap-2">
					<BasicButton onClick={handleCancel}>{t("common.cancel")}</BasicButton>
					<BasicButton type="primary" htmlType="submit">
						{t("common.save")}
					</BasicButton>
				</div>
			</Form>
		</Modal>
	);
}
