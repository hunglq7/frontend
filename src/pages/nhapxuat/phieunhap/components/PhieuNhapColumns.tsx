import type { ProColumns } from "@ant-design/pro-components";
import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/types.js";
import { Button, Popconfirm } from "antd";

interface Props {
	onEdit: (record: PhieuNhapItemType) => void
	onDelete: (id: number) => void
}

export function PhieuNhapColumns({
	onEdit,
	onDelete,
}: Props): ProColumns<PhieuNhapItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Mã phiếu nhập",
			dataIndex: "ma_phieu_nhap",
			search: true,
		},
		{
			title: "Ngày nhập",
			dataIndex: "ngay_nhap",
			search: true,

		},
		{
			title: "Đơn vị",
			dataIndex: "ten_don_vi",
			search: true,
		},
		{
			title: "Người nhập",
			dataIndex: "nguoi_nhap",
			search: true,
		},
		{
			title: "Ghi chú",
			dataIndex: "ghi_chu",
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
