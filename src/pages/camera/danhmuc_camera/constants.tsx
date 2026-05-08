import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import type { DanhMucCameraItemType } from "#src/api/camera/danhmuc_camera/types";

export function getConstantColumns(
	t: TFunction<"translation", undefined>,
): ProColumns<DanhMucCameraItemType>[] {
	return [
		{
			disable: true,
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			disable: true,
			title: t("danhmuc.tenThietBi"),
			dataIndex: "ten_thiet_bi",
			key: "ten_thiet_bi",
			width: 200,
			sorter: true,
		},
		{
			disable: true,
			title: t("danhmuc.thongSoKyThuat"),
			dataIndex: "thong_so_ky_thuat",
			key: "thong_so_ky_thuat",
			width: 250,
			sorter: true,
		},
		{
			disable: true,
			title: t("danhmuc.hangSanXuat"),
			dataIndex: "hang_san_xuat",
			key: "hang_san_xuat",
			width: 150,
			sorter: true,
		},
		{
			disable: true,
			title: t("danhmuc.nuocSanXuat"),
			dataIndex: "nuoc_san_xuat",
			key: "nuoc_san_xuat",
			width: 150,
			sorter: true,
		},
	];
}
