import type { AppRouteRecordRaw } from "#src/router/types";

export interface AuthType {
	token: string;
	refreshToken: string;
}

export interface LoginInfo {
	username: string;
	password: string;
}

export interface UserRegisterPayload {
	username: string;
	email: string;
	password: string;
}

export interface UserInfoType {
	id: string;
	avatar: string;
	username: string;
	email: string;
	phoneNumber?: string;
	description?: string;
	roles: Array<string>;
	// 路由可以在此处动态添加
	menus?: AppRouteRecordRaw[];
}

export interface UserItemType {
	id: number;
	username: string;
	email: string;
	phone?: string;
	avatar?: string;
	description?: string;
	roles: string[];
	created_at: string;
}

export interface UserListResponse {
	list: UserItemType[];
	total: number;
}

export interface UserSavePayload {
	username: string;
	email: string;
	phone?: string;
	avatar?: string;
	password: string;
	roles: string[];
}

export interface UserUpdatePayload {
	username?: string;
	email?: string;
	phone?: string;
	avatar?: string;
	description?: string;
	password?: string;
	roles?: string[];
}

export interface AuthListProps {
	label: string;
	name: string;
	auth: string[];
}
