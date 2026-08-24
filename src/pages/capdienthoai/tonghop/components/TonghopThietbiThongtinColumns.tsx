/* cspell:disable */
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types";
import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Tag } from "antd";
import dayjs from "dayjs";

interface Props {
	onEdit: (record: TonghopThietbiThongtinItemType) => void
	onDelete: (id: number) => void
	thietBiList: ThietBiItemType[]
	loaiThietBiList: LoaiThietBiItemType[]
	donViTinhList: DonViTinhItemType[]
	danhMucDonViList: DanhMucDonViItemType[]
	viTriList: ViTriLapDatItemType[]
	KhuVucList: KhuVucItemType[]
}

export function TonghopThietbiThongtinColumns({
	onEdit,
	onDelete,
	thietBiList,
	loaiThietBiList,
	donViTinhList,
	danhMucDonViList,
	viTriList,
	KhuVucList,
}: Props): ProColumns<TonghopThietbiThongtinItemType>[] {
	const toSelectOptions = <T extends { id: number }>(
		items: T[],
		getLabel: (item: T) => string,
	) =>
		items.map(item => ({
			label: getLabel(item),
			value: getLabel(item),
		}));

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
			dataIndex: "ten_thiet_bi",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
				options: toSelectOptions(thietBiList, item => item.ten_thiet_bi),
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
			title: "Đơn vị",
			dataIndex: "ten_don_vi",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
				options: toSelectOptions(danhMucDonViList, item => item.ten_don_vi),
			},

			valueEnum: danhMucDonViList.reduce(
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
			dataIndex: "ten_vi_tri",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
				options: toSelectOptions(viTriList, item => item.ten_vi_tri),
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
			title: "Khu vực",
			dataIndex: "ten_khu_vuc",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
				options: toSelectOptions(KhuVucList, item => item.ten_khu_vuc),
			},

			valueEnum: KhuVucList.reduce(
				(acc, item) => {
					acc[item.id] = {
						text: item.ten_khu_vuc,
					};
					return acc;
				},
				{} as Record<number, { text: string }>,
			),

			render: (_, record) => {
				return record.ten_khu_vuc;
			},
		},
		{
			title: "Loại thiết bị",
			dataIndex: "ten_loai",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
				options: toSelectOptions(loaiThietBiList, item => item.ten_loai),
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
			dataIndex: "ten_don_vi_tinh",
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
				options: toSelectOptions(donViTinhList, item => item.ten_don_vi_tinh),
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
			title: "Ngày lắp",
			dataIndex: "ngay_lap",
			valueType: "date",
			fieldProps: {
				format: "DD/MM/YYYY",
			},
			width: 150,
			search: false,
			render: (_, record) => {
				const dateValue = record.ngay_lap;
				if (!dateValue) {
					return "_";
				}
				const date = dayjs(dateValue);
				return date.isValid() ? date.format("DD/MM/YYYY") : "_";
			},
		},
		{
			disable: true,
			title: "Tình trạng",
			dataIndex: "tinh_trang",
			valueType: "switch",
			width: 80,
			render: (text, record) => {
				return (
					<Tag color={record.tinh_trang ? "success" : "red"}>
						{record.tinh_trang ? "Đang dùng" : "Dự phòng"}
					</Tag>
				);
			},
			valueEnum: {
				1: {
					text: "Đang dùng",
				},
				0: {
					text: "Dự phòng",
				},
			},
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
