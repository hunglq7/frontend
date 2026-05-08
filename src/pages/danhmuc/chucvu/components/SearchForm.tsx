import { Button, Card, Col, Input, Row } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface SearchFormProps {
	searchTenChucVu: string;
	setSearchTenChucVu: (value: string) => void;
	onClearFilters: () => void;
}

export function SearchForm({
	searchTenChucVu,
	setSearchTenChucVu,
	onClearFilters,
}: SearchFormProps) {
	const { t } = useTranslation();

	return (
		<Card style={{ marginBottom: 16 }}>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={8}>
					<label style={{ display: "block", marginBottom: 4, fontSize: 12 }}>
						{t("danhmuc.tenChucVu") || "Tên chức vụ"}
					</label>
					<Input
						placeholder={t("danhmuc.tenChucVuPlaceholder") || "Nhập tên chức vụ"}
						value={searchTenChucVu}
						onChange={(e) => setSearchTenChucVu(e.target.value)}
						allowClear
					/>
				</Col>
			</Row>
			<Row style={{ marginTop: 12, justifyContent: "flex-end" }}>
				<Button icon={<ClearOutlined />} onClick={onClearFilters}>
					{t("common.clear") || "Xóa"}
				</Button>
			</Row>
		</Card>
	);
}
