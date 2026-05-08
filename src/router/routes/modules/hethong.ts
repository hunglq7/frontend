import type { AppRouteRecordRaw } from "#src/router/types";

import ContainerLayout from "#src/layout/container-layout";
import { lazy } from "react";
import { $t } from "#src/locales";
const TaiKhoan = lazy(() => import("#src/pages/hethong/taikhoan"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/hethong",
		Component: ContainerLayout,
		handle: {
			icon: "SettingOutlined",
			title: $t("hethong.menu.hethong"),
			order: 4,
			roles: ["admin"],
		},
		children: [
			{
				path: "/hethong/taikhoan",
				Component: TaiKhoan,
				handle: {
					icon: "UserOutlined",
					title: $t("hethong.menu.taikhoan"),
					roles: ["admin"],
				},
			},
		],
	},
];

export default routes;
