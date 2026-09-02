import type { AppRouteRecordRaw } from "#src/router/types";
import ContainerLayout from "#src/layout/container-layout";
import {
	AppstoreOutlined,
	CameraOutlined,
	ProfileOutlined,
} from "@ant-design/icons";
import { createElement, lazy } from "react";

const DanhMucCameraPage = lazy(() => import("#src/pages/camera/danhmuc"));
const DanhsachCameraPage = lazy(
	() => import("#src/pages/camera/danhsach"),
);
const TongHopCamera = lazy(() => import("#src/pages/camera/tonghop"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/camera",
		Component: ContainerLayout,
		handle: {
			icon: createElement(CameraOutlined),
			title: "camera.menu.camera",
			order: 3,
			roles: ["user", "admin"],
		},
		children: [
			{
				path: "/camera/dansach",
				Component: DanhsachCameraPage,
				handle: {
					icon: createElement(ProfileOutlined),
					title: "camera.menu.danhmuc",
					roles: ["user", "admin"],
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/camera/danhmuc",
				Component: DanhMucCameraPage,
				handle: {
					icon: createElement(AppstoreOutlined),
					title: "camera.menu.danhmucCamera",
					roles: ["user", "admin"],
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/camera/tonghop",
				Component: TongHopCamera,
				handle: {
					icon: "TableOutlined",
					title: "camera.menu.tonghop",
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
