import type { ProColumns } from "@ant-design/pro-components";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import { Button, Popconfirm } from "antd";

interface Props {
	onEdit: (record: LoaiThietBiItemType) => void
	onDelete: (id: number) => void
}

export function LoaiThietBiColumns({
	onEdit,
	onDelete,
}: Props): ProColumns<LoaiThietBiItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Tên loại thiết bị",
			dataIndex: "ten_loai",
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
