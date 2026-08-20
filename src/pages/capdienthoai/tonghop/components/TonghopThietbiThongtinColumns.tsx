import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types.js";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types.js";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";

interface Props {
	onEdit: (record: TonghopThietbiThongtinItemType) => void
	onDelete: (id: number) => void
	thietBiList: ThietBiItemType[]
	loaiThietBiList: LoaiThietBiItemType[]
	donViTinhList: DonViTinhItemType[]
}

export function TonghopThietbiThongtinColumns({
	onEdit,
	onDelete,
	thietBiList,
	loaiThietBiList,
	donViTinhList,
}: Props): ProColumns<TonghopThietbiThongtinItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 80,
			search: false,
			render: (_, __, index) => index + 1,
		},
		{
			title: "Thiết bị",
			dataIndex: "thiet_bi_id",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
			},

			valueEnum: thietBiList.reduce(
				(acc, item) => {
					acc[item.id] = {
						text: item.ten_thiet_bi,
					};

					return acc;
				},
				{} as Record<number, { text: string }>,
			),

			render: (_, record) => {
				return record.ten_thiet_bi;
			},
		},
		{
			title: "Loại thiết bị",
			dataIndex: "loai_thiet_bi_id",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
			},

			valueEnum: loaiThietBiList.reduce(
				(acc, item) => {
					acc[item.id] = {
						text: item.ten_loai,
					};

					return acc;
				},
				{} as Record<number, { text: string }>,
			),

			render: (_, record) => {
				return record.ten_loai;
			},
		},
		{
			title: "Đơn vị tính",
			dataIndex: "don_vi_tinh_id",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
			},

			valueEnum: donViTinhList.reduce(
				(acc, item) => {
					acc[item.id] = {
						text: item.ten_don_vi_tinh,
					};

					return acc;
				},
				{} as Record<number, { text: string }>,
			),

			render: (_, record) => {
				return record.ten_don_vi_tinh;
			},
		},

		{
			title: "Số lượng",
			dataIndex: "so_luong",
			search: false,
		},
		{
			title: "Tình trạng",
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
