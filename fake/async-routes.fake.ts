import { access, home } from "#/src/router/extra-info";
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { ADMIN_TOKEN } from "./constants";
import { resultSuccess } from "./utils";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const homeRouter = {
	path: "/home",
	component: "/home/index.tsx",
	handle: {
		icon: "HomeOutlined",
		title: "common.menu.home",
		order: home,
	},
};

export default defineFakeRoute([
	{
		url: "/get-async-routes",
		timeout: 1000,
		method: "get",
		response: ({ headers }) => {
			const userToken = headers.authorization?.split(" ")?.[1];
			const isAdmin = userToken === ADMIN_TOKEN;
			const _accessRouter = {
				path: "/access",
				handle: {
					icon: "SafetyOutlined",
					title: "common.menu.access",
					order: access,
				},
				children: [
					/**
					 * @zh 通过接口获取路由时可见
					 * @en Visible only when getting routes through the interface
					 */
					{
						path: "/access/access-mode",
						handle: {
							icon: "CloudOutlined",
							title: "common.menu.accessMode",
						},
					},
					{
						path: "/access/page-control",
						handle: {
							icon: "FileTextOutlined",
							title: "common.menu.pageControl",
						},
					},
					{
						path: "/access/button-control",
						handle: {
							icon: "LockOutlined",
							title: "common.menu.buttonControl",
							permissions: isAdmin
								? [
									"permission:button:get",
									"permission:button:update",
									"permission:button:delete",
									"permission:button:add",
								]
								: ["permission:button:get"],
						},
					},
					isAdmin
						? {
							path: "/access/admin-visible",
							handle: {
								icon: "EyeOutlined",
								title: "common.menu.adminVisible",
							},
						}
						: {
							path: "/access/common-visible",
							handle: {
								icon: "EyeOutlined",
								title: "common.menu.commonVisible",
							},
						},
				],
			};
			return resultSuccess([homeRouter]);
		},
	},
]);
