import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/types.js";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";
import dayjs from "dayjs";

interface Props {
	onEdit: (record: PhieuNhapItemType) => void
	onDelete: (id: number) => void
	donViList: DanhMucDonViItemType[]
}

export function PhieuNhapColumns({
	onEdit,
	onDelete,
	donViList,
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
			valueType: "date",
			fieldProps: {
				format: "DD/MM/YYYY",
			},
			search: true,
			render: (_, recode) => {
				return recode.ngay_nhap
					? dayjs(recode.ngay_nhap).format("DD/MM/YYYY")
					: "_";
			},
		},
		{
			title: "Đơn vị",
			dataIndex: "don_vi_id",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
			},

			valueEnum: donViList.reduce(
				(acc, item) => {
					acc[item.id] = {
						text: item.ten_don_vi,
					};

					return acc;
				},
				{} as Record<number, { text: string }>,
			),

			render: (_, record) => {
				return record.ten_don_vi;
			},
		},
		{
			title: "Người nhập",
			dataIndex: "nguoi_nhap",
			search: true,
		},
		{
			title: "Ghi chú",
			dataIndex: "ghi_chu",
			search: false,
		},

		{
			title: "Hành động",
			valueType: "option",
			width: 180,

			render: (_, record) => [
				<Button key="edit" type="link" onClick={() => onEdit(record)}>
					Sửa
				</Button>,

				<Popconfirm
					key="delete"
					title="Bạn có chắc muốn xóa?"
					onConfirm={() => onDelete(record.id)}
				>
					<Button type="link" danger>
						Xóa
					</Button>
				</Popconfirm>,
			],
		},
	];
}
