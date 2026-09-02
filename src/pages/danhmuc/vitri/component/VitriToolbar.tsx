import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import VitriExportExcel from "../component/VitriExportExcel";

interface Props {
	selectedRowKeys: React.Key[]
	onAdd: () => void
	onDeleteMany: () => void
	data: ViTriLapDatItemType[]
}

function VitriToolBar({
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

			<VitriExportExcel data={data} />
		</Space>
	);
}

export default VitriToolBar;
