import { useMemo } from "react";
import { useMatches } from "react-router";

/**
 * 获取当前路由信息
 *
 * @returns 当前路由的匹配结果
 */
export function useCurrentRoute() {
	const matches = useMatches();

	const currentRoute = useMemo(() => {
		// Filter out the 404 fallback route (id: "404") and get the last actual route
		const actualMatches = matches.filter(match => match.id !== "404");
		const match
			= actualMatches.length > 0 ? actualMatches.at(-1) : matches.at(-1);

		return match;
	}, [matches]);

	return currentRoute;
}
