import type { AppRouteRecordRaw } from "#src/router/types";
import ContainerLayout from "#src/layout/container-layout";
import {
	ApartmentOutlined,
	FolderOutlined,
} from "@ant-design/icons";

import { createElement, lazy } from "react";

const DanhmucCapdienthoai = lazy(() => import("#src/pages/capdienthoai/danhmuc"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/capdienthoai",
		Component: ContainerLayout,
		handle: {
			icon: createElement(FolderOutlined),
			title: "common.menu.capdienthoai",
			order: 3,
			ignoreAccess: true,
		},
		children: [
			{
				path: "/capdienthoai/danhmuc/",
				Component: DanhmucCapdienthoai,
				handle: {
					icon: createElement(ApartmentOutlined),
					title: "danhmuc.danhmuc",
					ignoreAccess: true,
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
