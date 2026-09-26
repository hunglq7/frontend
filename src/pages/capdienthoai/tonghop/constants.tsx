import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { SelectOption, TonghopOptions } from "./types";
import { Tag } from "antd";
import dayjs from "dayjs";

function toValueEnum(options: SelectOption[]) {
	return options.reduce(
		(result, option) => {
			result[option.value] = { text: option.label };
			return result;
		},
		{} as Record<number, { text: string }>,
	);
}

export function getConstantColumns(
	t: TFunction<"translation", undefined>,
	options: TonghopOptions,
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
			valueEnum: toValueEnum(options.thietBi),
			render: (_, record) => record.ten_thiet_bi,
		},
		{
			title: t("thietbi.ten_don_vi"),
			dataIndex: "don_vi_id",
			key: "ten_don_vi",
			width: 200,
			sorter: true,
			valueType: "select",
			fieldProps: { showSearch: true, optionFilterProp: "label" },
			valueEnum: toValueEnum(options.donVi),
			render: (_, record) => record.ten_don_vi,
		},
		{
			title: t("thietbi.ten_vi_tri"),
			dataIndex: "vi_tri_id",
			key: "ten_vi_tri",
			width: 200,
			sorter: true,
			valueType: "select",
			fieldProps: { showSearch: true, optionFilterProp: "label" },
			valueEnum: toValueEnum(options.viTriLapDat),
			render: (_, record) => record.ten_vi_tri,
		},
		{
			title: t("thietbi.ten_khu_vuc"),
			dataIndex: "khu_vuc_id",
			key: "ten_khu_vuc",
			width: 200,
			sorter: true,
			valueType: "select",
			fieldProps: { showSearch: true, optionFilterProp: "label" },
			valueEnum: toValueEnum(options.khuVuc),
			render: (_, record) => record.ten_khu_vuc,
		},

		{
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
