import type { DanhMucChucVuItemType as ChucvuItem } from "#src/api/danhmuc/chucvu/types.js";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";

interface Props {
	onEdit: (record: ChucvuItem) => void
	onDelete: (id: number) => void
}

export function ChucVuColumns({
	onEdit,
	onDelete,
}: Props): ProColumns<ChucvuItem>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Tên chức vụ",
			dataIndex: "ten_chuc_vu",
			search: true,
		},

		{
			title: "Hành động",
			valueType: "option",
			width: 180,

			render: (_, record) => [
				<Button
					key="edit"
					type="link"
					onClick={() => onEdit(record)}
				>
					Sửa
				</Button>,

				<Popconfirm
					key="delete"
					title="Bạn có chắc muốn xóa?"
					onConfirm={() => onDelete(record.id)}
				>
					<Button
						type="link"
						danger
					>
						Xóa
					</Button>
				</Popconfirm>,
			],
		},
	];
}
