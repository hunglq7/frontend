import type { AppRouteRecordRaw } from "#src/router/types";
import { InboxOutlined, ProfileOutlined } from "@ant-design/icons";
import { createElement, lazy } from "react";
import ContainerLayout from "#src/layout/container-layout";

const PhieuNhap = lazy(() => import("#src/pages/nhapxuat/phieunhap"));
const PhieuXuat = lazy(() => import("#src/pages/nhapxuat/phieuxuat"));
const ChiTietPhieuNhap = lazy(
	() => import("#src/pages/nhapxuat/chitietphieunhap"),
);
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
			{
				path: "/nhapxuat/phieuxuat",
				Component: PhieuXuat,
				handle: {
					icon: createElement(ProfileOutlined),
					title: "nhapxuat.menu.phieuxuat",
					roles: ["user", "admin"],
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/nhapxuat/chitietphieunhap",
				Component: ChiTietPhieuNhap,
				handle: {
					icon: createElement(ProfileOutlined),
					title: "nhapxuat.menu.chitietphieunhap",
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
