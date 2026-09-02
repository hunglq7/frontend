import type { AppRouteRecordRaw } from "#src/router/types";
import ContainerLayout from "#src/layout/container-layout";
import {
	ApartmentOutlined,
	FolderOutlined,
} from "@ant-design/icons";

import { createElement, lazy } from "react";

const TonghopThietbiThongtinPage = lazy(() => import("#src/pages/capdienthoai/tonghop"));
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
				path: "/capdienthoai/tonghop/",
				Component: TonghopThietbiThongtinPage,
				handle: {
					icon: createElement(ApartmentOutlined),
					title: "danhmuc.tonghop.thietbiThongtin",
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
