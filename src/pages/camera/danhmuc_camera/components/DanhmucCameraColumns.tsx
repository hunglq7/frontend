import type { DanhMucCameraItemType } from "#src/api/camera/danhmuc_camera/types.js";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";

interface Props {
	onEdit: (record: DanhMucCameraItemType) => void
	onDelete: (id: number) => void
}

export function DanhMucCameraColumns({
	onEdit,
	onDelete,
}: Props): ProColumns<DanhMucCameraItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Tên thiết bị",
			dataIndex: "ten_thiet_bi",
			search: true,
		},
		{
			title: "Thông số kỹ thuật",
			dataIndex: "thong_so_ky_thuat",
			search: true,
		},
		{
			title: "Hãng sản xuất",
			dataIndex: "hang_san_xuat",
			search: true,
		},
		{
			title: "Nước sản xuất",
			dataIndex: "nuoc_san_xuat",
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
