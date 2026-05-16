import type { ProColumns } from "@ant-design/pro-components";
import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types.js";
import { Button, Popconfirm } from "antd";

interface Props {
	onEdit: (record: KhuVucItemType) => void
	onDelete: (id: number) => void
}

export function KhuVucColumns({
	onEdit,
	onDelete,
}: Props): ProColumns<KhuVucItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Tên khu vực",
			dataIndex: "ten_khu_vuc",
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
