import type { ChiTietPhieuNhapItemType } from "#src/api/nhapxuat/chitietphieunhap/types.js";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import ChiTietPhieuNhapExportExcel from "../utils/ChiTietPhieuNhapExportExcel";

interface Props {
	selectedRowKeys: React.Key[]
	onAdd: () => void
	onDeleteMany: () => void
	data: ChiTietPhieuNhapItemType[]
}

function ChiTietPhieuNhapToolBar({
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

			<ChiTietPhieuNhapExportExcel data={data} />
		</Space>
	);
}

export default ChiTietPhieuNhapToolBar;
