import type {
	LoginInfo,
	UserInfoType,
	UserItemType,
	UserListResponse,
	UserRegisterPayload,
	UserSavePayload,
	UserUpdatePayload,
} from "./types";

import { useAuthStore } from "#src/store/auth";
import { request } from "#src/utils/request";

const BASE64_URL_DASH_REGEX = /-/g;
const BASE64_URL_UNDERSCORE_REGEX = /_/g;

function base64UrlDecode(value: string) {
	return value
		.replace(BASE64_URL_DASH_REGEX, "+")
		.replace(BASE64_URL_UNDERSCORE_REGEX, "/");
}

export * from "./types";

// export function fetchLogin(data: LoginInfo) {
// 	return request
// 		.post("api/Users/authenticate", { json: data })
// 		.json<{ isSuccessed: boolean; message: string; resultObj: string }>();
// }

export function fetchLogin(data: LoginInfo) {
	return request.post("api/auth/login", { json: data }).json<{
		access_token: string
		refresh_token: string
		token_type: string
		user_id: number
	}>();
}

export function fetchRegister(data: UserRegisterPayload) {
	return request.post("api/auth/register", { json: data }).json<{
		access_token: string
		refresh_token: string
		token_type: string
		user_id: number
	}>();
}

export function fetchLogout(refreshToken: string) {
	return request.post("api/auth/logout", { json: { refreshToken } }).json();
}

export function fetchAsyncRoutes() {
	return request.get("api/Users/get-async-routes").json();
}

export async function fetchUserInfo(): Promise<UserInfoType> {
	const token = useAuthStore.getState().token;
	if (!token) {
		throw new Error("No token");
	}

	try {
		const payload = token.split(".")[1];
		const base64 = base64UrlDecode(payload);
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join(""),
		);
		const decoded = JSON.parse(jsonPayload);
		const userId = decoded.sub || decoded.id;
		if (!userId) {
			throw new Error("No user id in token");
		}

		const user = await request.get(`api/users/${userId}`).json<UserInfoType>();
		return {
			id: String(user.id),
			username: user.username || "",
			email: user.email || "",
			phoneNumber: (user as any).phone || "",
			description: user.description || "",
			avatar: user.avatar || "",
			roles: Array.isArray(user.roles) ? user.roles.map(String) : [],
		};
	}
	catch (error) {
		console.error("Failed to fetch user info", error);
		throw error;
	}
}

export interface RefreshTokenResult {
	access_token: string
	refresh_token: string
	token_type: string
	user_id: number
}

export function fetchRefreshToken(data: { readonly refresh_token: string }) {
	return request
		.post("auth/refresh", { json: data })
		.json<RefreshTokenResult>();
}

export function fetchUserList(skip = 0, limit = 100) {
	return request
		.get("api/users", { searchParams: { skip, limit } })
		.json<UserListResponse>();
}

function normalizeUserPayload<T extends { phone?: string, phoneNumber?: string }>(data: T) {
	const phoneValue = data.phone ?? data.phoneNumber ?? "";
	return {
		...data,
		phone: phoneValue || undefined,
		phoneNumber: phoneValue || undefined,
	};
}

export function fetchCreateUser(data: UserSavePayload) {
	const payload = normalizeUserPayload(data);
	return request.post("api/users", { json: payload }).json<UserItemType>();
}

export async function fetchUpdateUser(
	id: number,
	data: UserUpdatePayload,
): Promise<UserInfoType> {
	const payload = normalizeUserPayload(data);
	const response = await request
		.put(`api/users/${id}`, { json: payload })
		.json<UserItemType>();
	return {
		id: String(response.id),
		username: response.username || "",
		email: response.email || "",
		phoneNumber: (response as any).phone || (response as any).phoneNumber || "",
		description: response.description || "",
		avatar: response.avatar || "",
		roles: Array.isArray(response.roles) ? response.roles.map(String) : [],
	};
}

export function fetchDeleteUser(id: number) {
	return request.delete(`api/users/${id}`).json<{ deleted: number }>();
}

export function fetchDeleteUsers(ids: number[]) {
	return request
		.delete("api/users", { json: { ids } })
		.json<{ deleted: number }>();
}

export function fetchUploadAvatar(file: File) {
	const formData = new FormData();
	formData.append("file", file);

	// Use fetch directly for FormData to avoid ky issues
	return fetch(`${import.meta.env.VITE_API_BASE_URL}upload/avatar`, {
		method: "POST",
		body: formData,
		headers: {
			Authorization: `Bearer ${useAuthStore.getState().token}`,
		},
	}).then((response) => {
		if (!response.ok) {
			throw new Error(`Upload failed: ${response.status}`);
		}
		return response.json();
	});
}
