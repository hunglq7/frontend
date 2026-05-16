import type { DanhMucDonViItemType as DonViItem } from "#src/api/danhmuc/donvi/types.js";
import { BasicButton } from "#src/components/basic-button";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { Popconfirm, Space } from "antd";
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
				icon={<PlusOutlined />}
				onClick={onAdd}
			>
				Thêm
			</BasicButton>
			{selectedCount > 0 && (
				<Popconfirm
					title={`Bạn có chắc muốn xóa ${selectedCount} dòng đã chọn?`}
					onConfirm={onDeleteMultiple}
				>
					<BasicButton
						danger
						disabled={!selectedCount}
						icon={<DeleteOutlined />}
					>
						Xóa nhiều
					</BasicButton>
				</Popconfirm>
			)}

			<ExportExcelButton data={data} />
		</Space>
	);
}
