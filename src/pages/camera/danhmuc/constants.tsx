import type { DanhmucCameraItemType } from "#src/api/camera/danhmuc/types";
import type { ProColumns } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import { Tag } from "antd";

export function getConstantColumns(
	t: TFunction<"translation", undefined>,
): ProColumns<DanhmucCameraItemType>[] {
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
			title: t("camera.location"),
			dataIndex: "location",
			key: "location",
			width: 200,
			sorter: true,
		},
		{
			disable: true,
			title: t("camera.ipAddress"),
			dataIndex: "ip_address",
			key: "ip_address",
			width: 200,
			sorter: true,
		},
		{
			disable: true,
			title: t("camera.khuvuc"),
			dataIndex: "name",
			key: "name",
			width: 200,
			sorter: true,
		},
		{
			disable: true,
			title: t("camera.status"),
			dataIndex: "is_online",
			valueType: "select",
			width: 80,
			render: (text, record) => {
				return (
					<Tag color={record.is_online ? "success" : "red"}>
						{record.is_online ? t("camera.enabled") : t("camera.deactivated")}
					</Tag>
				);
			},
			valueEnum: {
				true: {
					text: t("camera.enabled"),
				},
				false: {
					text: t("camera.deactivated"),
				},
			},
		},
		{
			title: t("camera.last_check"),
			dataIndex: "last_check",
			valueType: "date",
			width: 150,
			search: false,
		},
	];
}
