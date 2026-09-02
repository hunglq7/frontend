import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types.js";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import KhuVucExportExcel from "../utils/KhuVucExportExcel";

interface Props {
	selectedRowKeys: React.Key[]
	onAdd: () => void
	onDeleteMany: () => void
	data: KhuVucItemType[]
}

function KhuVucToolBar({
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
					title={`Bạn có muốn xóa ${selectedRowKeys.length} bản ghi`}
					onConfirm={onDeleteMany}
				>
					<Button danger icon={<DeleteOutlined />}>
						Xóa dòng chọn
					</Button>
				</Popconfirm>
			)}

			<KhuVucExportExcel data={data} />
		</Space>
	);
}

export default KhuVucToolBar;
