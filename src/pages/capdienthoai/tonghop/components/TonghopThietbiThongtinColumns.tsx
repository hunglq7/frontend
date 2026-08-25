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
	khuVucList: KhuVucItemType[]
}

// Helper reusable để tạo cấu hình cho các cột Select/Filter
function createSelectColumnConfig<T extends { id: number }>(items: T[], getLabel: (item: T) => string): Partial<ProColumns<TonghopThietbiThongtinItemType>> {
	return {
		valueType: "select",
		fieldProps: {
			showSearch: true,
			optionFilterProp: "label",
			options: items.map((item) => {
				const label = getLabel(item);
				return { label, value: label };
			}),
		},
		valueEnum: items.reduce<Record<string, { text: string }>>((acc, item) => {
			const label = getLabel(item);
			acc[label] = { text: label };
			return acc;
		}, {}),
	};
}

export function TonghopThietbiThongtinColumns({
	onEdit,
	onDelete,
	thietBiList,
	loaiThietBiList,
	donViTinhList,
	danhMucDonViList,
	viTriList,
	khuVucList,
}: Props): ProColumns<TonghopThietbiThongtinItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 60,
			search: false,
			render: (_, __, index) => index + 1,
		},
		{
			title: "Thiết bị",
			dataIndex: "ten_thiet_bi",
			...createSelectColumnConfig(thietBiList, item => item.ten_thiet_bi),
		},
		{
			title: "Đơn vị",
			dataIndex: "ten_don_vi",
			...createSelectColumnConfig(danhMucDonViList, item => item.ten_don_vi),
		},
		{
			title: "Vị trí",
			dataIndex: "ten_vi_tri",
			...createSelectColumnConfig(viTriList, item => item.ten_vi_tri),
		},
		{
			title: "Khu vực",
			dataIndex: "ten_khu_vuc",
			...createSelectColumnConfig(khuVucList, item => item.ten_khu_vuc),
		},
		{
			title: "Loại thiết bị",
			dataIndex: "ten_loai",
			...createSelectColumnConfig(loaiThietBiList, item => item.ten_loai),
		},
		{
			title: "Đơn vị tính",
			dataIndex: "ten_don_vi_tinh",
			...createSelectColumnConfig(donViTinhList, item => item.ten_don_vi_tinh),
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
			width: 120,
			search: false,
			render: (_, record) => {
				if (!record.ngay_lap)
					return "_";
				const date = dayjs(record.ngay_lap);
				return date.isValid() ? date.format("DD/MM/YYYY") : "_";
			},
		},
		{
			title: "Tình trạng",
			dataIndex: "tinh_trang",
			width: 110,
			valueEnum: {
				true: { text: "Đang dùng", status: "Success" },
				false: { text: "Dự phòng", status: "Error" },
				1: { text: "Đang dùng", status: "Success" },
				0: { text: "Dự phòng", status: "Error" },
			},
			render: (_, record) => (
				<Tag color={record.tinh_trang ? "success" : "red"}>
					{record.tinh_trang ? "Đang dùng" : "Dự phòng"}
				</Tag>
			),
		},
		{
			title: "Ghi chú",
			dataIndex: "ghi_chu",
			search: false,
		},
		{
			title: "Hành động",
			valueType: "option",
			width: 140,
			render: (_, record) => [
				<Button key="edit" type="link" size="small" onClick={() => onEdit(record)}>
					Sửa
				</Button>,
				<Popconfirm
					key="delete"
					title="Bạn có chắc muốn xóa?"
					onConfirm={() => onDelete(record.id)}
				>
					<Button type="link" danger size="small">
						Xóa
					</Button>
				</Popconfirm>,
			],
		},
	];
}
