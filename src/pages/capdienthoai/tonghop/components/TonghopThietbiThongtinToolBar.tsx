import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types.js";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import TonghopThietbiThongtinExportExcel from "../utils/TonghopThietbiThongtinExportExcel";

interface Props {
	selectedRowKeys: React.Key[]
	onAdd: () => void
	onDeleteMany: () => void
	data: TonghopThietbiThongtinItemType[]
}

function TonghopThietbiThongtinToolBar({
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

			<TonghopThietbiThongtinExportExcel data={data} />
		</Space>
	);
}

export default TonghopThietbiThongtinToolBar;
