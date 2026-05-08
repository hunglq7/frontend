import type { ReactNode } from "react";

import { useAccess } from "#src/hooks/use-access";

interface AccessControlProps {
	// 权限类型，默认为 code
	// eslint-disable-next-line style/member-delimiter-style
	type?: "code" | "role";
	// 权限值，可以是字符串或字符串数组
	// eslint-disable-next-line style/member-delimiter-style
	codes?: string | string[];
	// eslint-disable-next-line style/member-delimiter-style
	children?: ReactNode;
	// 无权限时显示，默认无权限不显示任何内容。
	// eslint-disable-next-line style/member-delimiter-style
	fallback?: ReactNode;
}

/* eslint-disable jsdoc/check-param-names, antfu/if-newline */
/**
 * 权限验证组件
 *
 * @param type 权限类型，默认为 code
 * @param codes 权限值，可以是字符串或字符串数组
 * @param children 子组件
 * @param fallback 无权限时显示，默认无权限不显示任何内容
 * @returns 若子组件存在，并且传入的权限值有效，则返回子组件；否则返回 null
 */
export function AccessControl({
	type = "code",
	codes,
	children,
	fallback,
}: AccessControlProps) {
	const { hasAccessByCodes, hasAccessByRoles } = useAccess();

	if (!children) return null;

	if (!type || type === "code") {
		return hasAccessByCodes(codes) ? children : fallback;
	}

	if (type === "role") {
		return hasAccessByRoles(codes) ? children : fallback;
	}

	return fallback;
	/* eslint-enable jsdoc/check-param-names, antfu/if-newline */
}
