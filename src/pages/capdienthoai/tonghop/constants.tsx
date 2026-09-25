import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types";
import { Tag } from "antd";
import dayjs from "dayjs";

export function getConstantColumns(
	t: TFunction<"translation", undefined>,
	thietBiList: ThietBiItemType[],
): ProColumns<TonghopThietbiThongtinItemType>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 60,
			search: false,
			render: (_, __, index) => index + 1,
		},
		{
			title: t("thietbi.ten_thiet_bi"),
			dataIndex: "thiet_bi_id",
			key: "ten_thiet_bi",
			width: 200,
			valueType: "select",
			fieldProps: {
				showSearch: true,
				optionFilterProp: "label",
			},
			valueEnum: thietBiList.reduce(
				(options, item) => {
					options[item.id] = { text: item.ten_thiet_bi };
					return options;
				},
				{} as Record<number, { text: string }>,
			),
			render: (_, record) => record.ten_thiet_bi,
		},
		{
			disable: true,
			title: t("thietbi.ten_don_vi"),
			dataIndex: "ten_don_vi",
			key: "ten_don_vi",
			width: 200,
			sorter: true,
		},
		{
			disable: true,
			title: t("thietbi.ten_vi_tri"),
			dataIndex: "ten_vi_tri",
			key: "ten_vi_tri",
			width: 200,
			sorter: true,
		},
		{
			disable: true,
			title: t("thietbi.ten_khu_vuc"),
			dataIndex: "ten_khu_vuc",
			key: "ten_khu_vuc",
			width: 200,
			sorter: true,
		},

		{
			disable: true,
			title: t("thietbi.ten_loai"),
			dataIndex: "ten_loai",
			key: "ten_loai",
			width: 200,
			sorter: true,
		},

		{
			disable: true,
			title: t("thietbi.ten_don_vi_tinh"),
			dataIndex: "ten_don_vi_tinh",
			key: "ten_don_vi_tinh",
			width: 200,
			sorter: true,
			search: false,
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
			search: true,
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
	];
}
