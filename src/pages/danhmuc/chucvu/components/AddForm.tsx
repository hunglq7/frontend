import { Card, Col, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import { BasicButton } from "#src/components/basic-button";

interface AddFormProps {
	newValue: string
	setNewValue: (value: string) => void
	onSave: () => void
	onCancel: () => void
}

export function AddForm({ newValue, setNewValue, onSave, onCancel }: AddFormProps) {
	const { t } = useTranslation();

	return (
		<Card style={{ marginBottom: 16 }}>
			<Row gutter={16}>
				<Col flex="auto">
					<Input
						placeholder={t("danhmuc.tenChucVuPlaceholder") || "Nhập tên chức vụ"}
						value={newValue}
						onChange={e => setNewValue(e.target.value)}
						autoFocus
						onPressEnter={onSave}
					/>
				</Col>
				<Col>
					<BasicButton type="primary" onClick={onSave}>
						{t("common.save") || "Lưu"}
					</BasicButton>
				</Col>
				<Col>
					<BasicButton onClick={onCancel}>
						{t("common.cancel") || "Hủy"}
					</BasicButton>
				</Col>
			</Row>
		</Card>
	);
}
