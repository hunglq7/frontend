import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

import { useTranslation } from "react-i18next";
import { BasicButton } from "#src/components/basic-button";
import { TEN_DON_VI_RULES } from "#src/constants/rules";

interface DetailProps {
	open: boolean
	setOpen: (open: boolean) => void
	title: string
	detailData: Partial<DanhMucDonViItemType>
	onFinish: (values: DanhMucDonViItemType) => Promise<void>
}

export function Detail({ open, setOpen, title, detailData, onFinish }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	useEffect(() => {
		if (open) {
			form.setFieldsValue(detailData);
		}
	}, [open, detailData, form]);

	const handleFinish = async (values: DanhMucDonViItemType) => {
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
					label={t("danhmuc.tenDonVi")}
					name="ten_don_vi"
					rules={TEN_DON_VI_RULES(t)}
				>
					<Input placeholder={t("danhmuc.tenDonViPlaceholder")} />
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
