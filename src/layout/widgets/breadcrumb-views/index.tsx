import type { BreadcrumbProps } from "antd";

import { Breadcrumb } from "antd";

import { useTranslation } from "react-i18next";
import { useLocation, useMatches } from "react-router";
import { useCurrentRoute } from "#src/hooks/use-current-route";
import { useAccessStore } from "#src/store/access";
import { isString } from "#src/utils/is";

const itemRender: BreadcrumbProps["itemRender"] = (route, params, routes) => {
	const last = routes.indexOf(route) === routes.length - 1;
	return last || !route.path
		? (
			<span>{route.title}</span>
		)
		: (
			<span>{route.title}</span>
			// <NavLink to={route.path}>{route.title}</NavLink>
		);
};

export function BreadcrumbViews() {
	const { t } = useTranslation();
	const matches = useMatches();
	const { pathname } = useLocation();
	const flatRouteList = useAccessStore(state => state.flatRouteList);
	const currentRoute = useCurrentRoute();

	return (
		<Breadcrumb
			className="hidden md:block"
			separator="->"
			// https://ant.design/components/breadcrumb#use-with-browserhistory
			itemRender={itemRender}
			items={matches
				// filter - root route & index route
				.filter(match => match.handle && !match.pathname.endsWith("/"))
				.map((match) => {
					const fallbackRoute = flatRouteList[match.pathname] ?? flatRouteList[pathname];
					const title = match.handle?.title === "404"
						? fallbackRoute?.handle?.title ?? currentRoute?.handle?.title
						: match.handle?.title;
					return {
						title: isString(title) ? t(title) : title,
						path: match.pathname,
					};
				})}
		/>
	);
}
