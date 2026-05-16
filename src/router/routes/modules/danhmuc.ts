import type { AppRouteRecordRaw } from "#src/router/types";
import {
	ApartmentOutlined,
	ClusterOutlined,
	EnvironmentOutlined,
	FolderOutlined,
	IdcardOutlined,
} from "@ant-design/icons";
import { createElement, lazy } from "react";

import ContainerLayout from "#src/layout/container-layout";

const DanhMucDonVi = lazy(() => import("#src/pages/danhmuc/donvi"));
const ViTriLapDat = lazy(() => import("#src/pages/danhmuc/vitri"));
const DanhMucChucVu = lazy(() => import("#src/pages/danhmuc/chucvu"));
const ThietBiPage = lazy(() => import("#src/pages/danhmuc/thietbi"));
const KhuVucPage = lazy(() => import("#src/pages/danhmuc/khuvuc"));
const routes: AppRouteRecordRaw[] = [
	{
		path: "/danhmuc",
		Component: ContainerLayout,
		handle: {
			icon: createElement(FolderOutlined),
			title: "common.menu.danhmuc",
			order: 3,
			ignoreAccess: true,
		},
		children: [
			{
				path: "/danhmuc/donvi",
				Component: DanhMucDonVi,
				handle: {
					icon: createElement(ApartmentOutlined),
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
					icon: createElement(EnvironmentOutlined),
					title: "danhmuc.viTriLapDatManagement",
					ignoreAccess: true,
				},
			},
			{
				path: "/danhmuc/chucvu",
				Component: DanhMucChucVu,
				handle: {
					icon: createElement(IdcardOutlined),
					title: "danhmuc.chucVuManagement",
					ignoreAccess: true,
				},
			},
			{
				path: "/danhmuc/thietbi",
				Component: ThietBiPage,
				handle: {
					icon: createElement(ClusterOutlined),
					title: "danhmuc.thietbi",
					ignoreAccess: true,
				},
			},
			{
				path: "/danhmuc/khuvuc",
				Component: KhuVucPage,
				handle: {
					icon: createElement(EnvironmentOutlined),
					title: "danhmuc.khuVucManagement",
					ignoreAccess: true,
				},
			},
		],
	},
];

export default routes;
