import type { UserInfoType } from "#src/api/user/types";
import { create } from "zustand";

import { fetchUserInfo } from "#src/api/user";

const initialState = {
	id: "",
	avatar: "",
	username: "",
	email: "",
	phoneNumber: "",
	description: "",
	roles: [],
	// menus: [],
};

type UserState = UserInfoType;

interface UserAction {
	getUserInfo: () => Promise<UserInfoType>
	setAvatar: (avatar: string) => void
	setUserInfo: (userInfo: Partial<UserInfoType>) => void
	reset: () => void
}

export const useUserStore = create<UserState & UserAction>()(set => ({
	...initialState,

	getUserInfo: async () => {
		const response = await fetchUserInfo();
		set({
			...response,
		});
		return response;
	},

	setAvatar: (avatar: string) => {
		set({ avatar });
	},

	setUserInfo: (userInfo: Partial<UserInfoType>) => {
		set(userInfo);
	},

	reset: () => {
		return set({
			...initialState,
		});
	},
}));
