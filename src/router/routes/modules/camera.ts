import type { AppRouteRecordRaw } from "#src/router/types";
import { lazy } from "react";
import ContainerLayout from "#src/layout/container-layout";

const DanhMucCamera = lazy(() => import("#src/pages/camera/danhmuc"));
const DanhMucCameraCatalog = lazy(
	() => import("#src/pages/camera/danhmuc_camera"),
);
const TongHopCamera = lazy(() => import("#src/pages/camera/tonghop"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/camera",
		Component: ContainerLayout,
		handle: {
			icon: "SettingOutlined",
			title: "camera.menu.camera",
			order: 3,
			roles: ["user", "admin"],
		},
		children: [
			{
				path: "/camera/danhmuc",
				Component: DanhMucCamera,
				handle: {
					icon: "TableOutlined",
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
				path: "/camera/danhmuc-camera",
				Component: DanhMucCameraCatalog,
				handle: {
					icon: "TableOutlined",
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
