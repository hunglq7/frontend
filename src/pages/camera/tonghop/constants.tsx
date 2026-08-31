import type { TonghopCameraItemType } from "#src/api/camera/tonghop/types";
import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";

export function getConstantColumns(
	t: TFunction<"translation", undefined>,
): ProColumns<TonghopCameraItemType>[] {
	return [
		{
			disable: true,
			dataIndex: "index",
			title: t("common.index"),
			valueType: "indexBorder",
			width: 80,
		},
		{
			title: t("camera.cameraId") || "Camera ID",
			dataIndex: "camera_id",
			key: "camera_id",
			width: 120,
			sorter: true,
		},
		{
			title: t("camera.totalScans") || "Total Scans",
			dataIndex: "total_scans",
			key: "total_scans",
			width: 120,
			sorter: true,
		},
		{
			title: t("camera.summary") || "Summary",
			dataIndex: "summary",
			key: "summary",
			width: 240,
		},
		{
			title: t("camera.lastUpdated") || "Last Updated",
			dataIndex: "last_updated",
			key: "last_updated",
			valueType: "dateTime",
			width: 180,
			search: false,
		},
	];
}
