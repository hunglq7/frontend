import type { DanhMucCapDienThoaiItemType } from "#src/api/capthongtin/danhmuc/index.js";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import CapdienthoaiExportExcel from "../utils/CapdienthoaiExportExcel";

interface Props {
	selectedRowKeys: React.Key[]
	onAdd: () => void
	onDeleteMany: () => void
	data: DanhMucCapDienThoaiItemType[]
}

function CapdienthoaiToolBar({
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

			<CapdienthoaiExportExcel data={data} />
		</Space>
	);
}

export default CapdienthoaiToolBar;
