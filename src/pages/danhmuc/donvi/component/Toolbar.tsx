import type { DanhMucDonViItemType as DonViItem } from "#src/api/danhmuc/donvi/types.js";
import { BasicButton } from "#src/components/basic-button";
import {
	DeleteOutlined,
	PlusOutlined,
} from "@ant-design/icons";

import { Space } from "antd";
import ExportExcelButton from "./ExportExcelButton";

interface Props {
	data: DonViItem[]
	selectedCount: number
	onAdd: () => void
	onDeleteMultiple: () => void
}

export default function Toolbar({
	data,
	selectedCount,
	onAdd,
	onDeleteMultiple,
}: Props) {
	return (
		<Space>
			<BasicButton
				type="primary"
				size="small"
				icon={<PlusOutlined />}
				onClick={onAdd}
			>
				Thêm
			</BasicButton>
			<BasicButton
				size="small"
				danger
				disabled={!selectedCount}
				icon={<DeleteOutlined />}
				onClick={onDeleteMultiple}
			>
				Xóa dòng chọn
			</BasicButton>
			<ExportExcelButton data={data} />
		</Space>
	);
}
