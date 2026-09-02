import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";

interface Props {
	onEdit: (record: ViTriLapDatItemType) => void
	onDelete: (id: number) => void
}

export function VitriColumns({
	onEdit,
	onDelete,
}: Props): ProColumns<ViTriLapDatItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Vị trí lắp đặt",
			dataIndex: "ten_vi_tri",
			search: true,
		},
		{
			title: "Mô tả",
			dataIndex: "mo_ta",
			search: false,
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
