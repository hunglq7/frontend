import type { AppRouteRecordRaw } from "#src/router/types";
import { lazy } from "react";
import ContainerLayout from "#src/layout/container-layout";

const DanhMucDonVi = lazy(() => import("#src/pages/danhmuc/donvi"));
const ViTriLapDat = lazy(() => import("#src/pages/danhmuc/vitri"));
const DanhMucChucVu = lazy(() => import("#src/pages/danhmuc/chucvu"));
const routes: AppRouteRecordRaw[] = [
	{
		path: "/danhmuc",
		Component: ContainerLayout,
		handle: {
			icon: "SettingOutlined",
			title: "common.menu.danhmuc",
			order: 3,
			ignoreAccess: true,
		},
		children: [
			{
				path: "/danhmuc/donvi",
				Component: DanhMucDonVi,
				handle: {
					icon: "TableOutlined",
					title: "danhmuc.donViManagement",
					ignoreAccess: true,
					permissions: [
						"permission:button:add",
						"permission:button:update",
						"permission:button:delete",
					],
				},
			},
			{
				path: "/danhmuc/vitri",
				Component: ViTriLapDat,
				handle: {
					icon: "TableOutlined",
					title: "danhmuc.viTriLapDatManagement",
					ignoreAccess: true,
				},
			},
			{
				path: "/danhmuc/chucvu",
				Component: DanhMucChucVu,
				handle: {
					icon: "TableOutlined",
					title: "danhmuc.chucVuManagement",
					ignoreAccess: true,
				},
			},
		],
	},
];

export default routes;
