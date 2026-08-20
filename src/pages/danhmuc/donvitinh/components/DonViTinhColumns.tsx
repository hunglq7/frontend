import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";

interface Props {
	onEdit: (record: DonViTinhItemType) => void
	onDelete: (id: number) => void
}

export function DonViTinhColumns({
	onEdit,
	onDelete,
}: Props): ProColumns<DonViTinhItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Tên đơn vị tính",
			dataIndex: "ten_don_vi_tinh",
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
