import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import { fetchDanhMucDonViList } from "#src/api/danhmuc/donvi/index";
import { create } from "zustand";

interface DonViState {
	listDonvi: DanhMucDonViItemType[]
	loading: boolean
	error: string | null
}

interface DonViAction {
	fetchDonViList: () => Promise<DanhMucDonViItemType[]>
	setDonViList: (list: DanhMucDonViItemType[]) => void
	reset: () => void
}

const initialState: DonViState = {
	listDonvi: [],
	loading: false,
	error: null,
};

export const useDonViStore = create<DonViState & DonViAction>()(set => ({
	...initialState,

	fetchDonViList: async () => {
		set({ loading: true, error: null });

		try {
			const response = await fetchDanhMucDonViList();
			set({ listDonvi: response, loading: false, error: null });
			return response;
		}
		catch (error) {
			const message
				= error instanceof Error ? error.message : "Lỗi khi lấy danh sách đơn vị";
			set({ loading: false, error: message, listDonvi: [] });
			return [];
		}
	},

	setDonViList: (listDonvi: DanhMucDonViItemType[]) => {
		set({ listDonvi });
	},

	reset: () => {
		set(initialState);
	},
}));
