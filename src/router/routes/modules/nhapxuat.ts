import type { AppRouteRecordRaw } from "#src/router/types";
import ContainerLayout from "#src/layout/container-layout";
import {
	InboxOutlined,
	ProfileOutlined,
} from "@ant-design/icons";
import { createElement, lazy } from "react";

const PhieuNhap = lazy(() => import("#src/pages/nhapxuat/phieunhap"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/nhapxuat",
		Component: ContainerLayout,
		handle: {
			icon: createElement(InboxOutlined),
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
