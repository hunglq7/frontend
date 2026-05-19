import type { ProColumns } from "@ant-design/pro-components";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types.js";
import type { PhieuXuatItemType } from "#src/api/nhapxuat/phieuxuat/types.js";
import { Button, Popconfirm } from "antd";
import dayjs from "dayjs";

interface Props {
	onEdit: (record: PhieuXuatItemType) => void
	onDelete: (id: number) => void
	donViList: DanhMucDonViItemType[]
	viTriList: ViTriLapDatItemType[]
}

export function PhieuXuatColumns({
	onEdit,
	onDelete,
	donViList,
	viTriList,
}: Props): ProColumns<PhieuXuatItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Mã phiếu xuất",
			dataIndex: "ma_phieu_xuat",
			search: true,
		},
		{
			title: "Ngày xuất",
			dataIndex: "ngay_xuat",
			valueType: "date",
			fieldProps: {
				format: "DD/MM/YYYY",
			},
			search: true,
			render: (_, recode) => {
				return recode.ngay_xuat
					? dayjs(recode.ngay_xuat).format("DD/MM/YYYY")
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
			title: "Vị trí",
			dataIndex: "vi_tri_id",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
			},

			valueEnum: viTriList.reduce(
				(acc, item) => {
					acc[item.id] = {
						text: item.ten_vi_tri,
					};

					return acc;
				},
				{} as Record<number, { text: string }>,
			),

			render: (_, record) => {
				return record.ten_vi_tri;
			},
		},
		{
			title: "Người xuất",
			dataIndex: "nguoi_xuat",
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
