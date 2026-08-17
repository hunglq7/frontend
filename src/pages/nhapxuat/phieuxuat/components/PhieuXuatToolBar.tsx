import type { PhieuXuatItemType } from "#src/api/nhapxuat/phieuxuat/types.js";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import PhieuXuatExportExcel from "../utils/PhieuXuatExportExcel";

interface Props {
	selectedRowKeys: React.Key[]
	onAdd: () => void
	onDeleteMany: () => void
	data: PhieuXuatItemType[]
}

function PhieuXuatToolBar({
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

			<PhieuXuatExportExcel data={data} />
		</Space>
	);
}

export default PhieuXuatToolBar;
