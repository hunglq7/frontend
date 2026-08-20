import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import DonViTinhExportExcel from "../utils/DonViTinhExportExcel";

interface Props {
	selectedRowKeys: React.Key[]
	onAdd: () => void
	onDeleteMany: () => void
	data: DonViTinhItemType[]
}

function DonViTinhToolBar({
	selectedRowKeys,
	onAdd,
	onDeleteMany,
	data,
}: Props) {
	return (
		<Space>
			<Button
				type="primary"
				icon={<PlusOutlined />}
				onClick={onAdd}
			>
				Thêm
			</Button>

			{selectedRowKeys.length > 0 && (
				<Popconfirm
					title="Bạn có chắc muốn xóa?"
					onConfirm={onDeleteMany}
				>
					<Button danger icon={<DeleteOutlined />}>
						Xóa nhiều
					</Button>
				</Popconfirm>
			)}

			<DonViTinhExportExcel data={data} />
		</Space>
	);
}

export default DonViTinhToolBar;
