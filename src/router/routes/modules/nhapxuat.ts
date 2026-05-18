import type { AppRouteRecordRaw } from "#src/router/types";
import {
	CameraOutlined,
	ProfileOutlined,
} from "@ant-design/icons";
import { createElement, lazy } from "react";
import ContainerLayout from "#src/layout/container-layout";

const PhieuNhap = lazy(() => import("#src/pages/nhapxuat/phieunhap"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/nhapxuat",
		Component: ContainerLayout,
		handle: {
			icon: createElement(CameraOutlined),
			title: "nhapxuat.menu.nhapxuat",
			order: 3,
			roles: ["user", "admin"],
		},
		children: [
			{
				path: "/nhapxuat/phieunhap",
				Component: PhieuNhap,
				handle: {
					icon: createElement(ProfileOutlined),
					title: "nhapxuat.menu.phieunhap",
					roles: ["user", "admin"],
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
		],
	},
];
export default routes;
