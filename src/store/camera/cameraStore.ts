import type { DanhsachCameraItemType } from "#src/api/camera/danhsach/types";
import { fetchAddDanhsachCameraItem, fetchDanhsachCamerasList, fetchDeleteDanhsachCameraItem, fetchDeleteMultipleDanhsachCameraItems, fetchTotalDanhsachCameras, fetchUpdateDanhsachCameraItem } from "#src/api/camera/danhsach/index.js";
import { create } from "zustand";

type CameraRecord = Record<string, any> & { id?: number };

interface CameraState {
	listCameras: CameraRecord[]
	totalCameras: number
	activeCount: number
	disconnectedCount: number
	loading: boolean
	error: string | null
}

interface CameraAction {
	fetchTotalCameras: () => Promise<number>
	fetchCameraList: () => Promise<DanhsachCameraItemType[]>
	fetchCameraSummary: () => Promise<{ activeCount: number, disconnectedCount: number }>
	fetchDeleteDanhsachCamera: (id: number) => Promise<void>
	fetchDeleteMultipleDanhsachCamera: (ids: number[]) => Promise<void>
	fetchAddDanhsachCamera: (data: DanhsachCameraItemType) => Promise<void>
	fetchUpdateDanhsachCamera: (id: number, data: DanhsachCameraItemType) => Promise<void>
	setTotalCameras: (total: number) => void
	incrementTotalCameras: (value?: number) => void
	decrementTotalCameras: (value?: number) => void
	reset: () => void
}

const initialState: CameraState = {
	listCameras: [],
	totalCameras: 0,
	activeCount: 0,
	disconnectedCount: 0,
	loading: false,
	error: null,
};

export const useCameraStore = create<CameraState & CameraAction>()(set => ({
	...initialState,

	fetchTotalCameras: async () => {
		set({ loading: true, error: null });

		try {
			const total = await fetchTotalDanhsachCameras();
			set({ totalCameras: total, loading: false, error: null });
			return total;
		}
		catch (error) {
			const message
				= error instanceof Error ? error.message : "Lỗi khi lấy danh sách đơn vị";
			set({ loading: false, error: message, totalCameras: 0 });
			return 0;
		}
	},

	fetchDeleteDanhsachCamera: async (id: number) => {
		set({ loading: true, error: null });
		try {
			await fetchDeleteDanhsachCameraItem(id);
			set(state => ({
				listCameras: state.listCameras.filter(camera => camera.id !== id),
				totalCameras: Math.max(0, state.totalCameras - 1),
				loading: false,
				error: null,
			}));
		}
		catch (error) {
			const message
				= error instanceof Error ? error.message : "Lỗi khi xóa danh mục camera";
			set({ loading: false, error: message });
		}
	},
	fetchDeleteMultipleDanhsachCamera: async (ids: number[]) => {
		set({ loading: true, error: null });
		try {
			await fetchDeleteMultipleDanhsachCameraItems(ids);
			set(state => ({
				listCameras: state.listCameras.filter(camera => !ids.includes(camera.id!)),
				totalCameras: Math.max(0, state.totalCameras - ids.length),
				loading: false,
				error: null,
			}));
		}
		catch (error) {
			const message
				= error instanceof Error ? error.message : "Lỗi khi xóa nhiều danh mục camera";
			set({ loading: false, error: message });
		}
	},
	fetchCameraList: async () => {
		set({ loading: true, error: null });
		try {
			const list = (await fetchDanhsachCamerasList()) as DanhsachCameraItemType[];
			set({ listCameras: list, loading: false, error: null });
			return list;
		}
		catch (error) {
			const message
				= error instanceof Error ? error.message : "Lỗi khi lấy danh sách camera";
			set({ loading: false, error: message, listCameras: [] });
			return [];
		}
	},

	fetchCameraSummary: async () => {
		set({ loading: true, error: null });
		try {
			const response = await fetchDanhsachCamerasList();
			const normalizedResponse = Array.isArray(response)
				? response
				: Array.isArray((response as any)?.result)
					? (response as any).result
					: Array.isArray((response as any)?.data)
						? (response as any).data
						: Array.isArray((response as any)?.items)
							? (response as any).items
							: [];

			const cameras = Array.isArray(normalizedResponse) ? normalizedResponse : [];
			const activeCount = cameras.filter((camera: any) => Boolean(camera?.is_online)).length;
			const disconnectedCount = cameras.filter((camera: any) => !camera?.is_online).length;

			set({
				activeCount,
				disconnectedCount,
				listCameras: cameras,
				loading: false,
				error: null,
			});

			return { activeCount, disconnectedCount };
		}
		catch (error) {
			const message = error instanceof Error ? error.message : "Lỗi khi lấy trạng thái camera";
			set({
				loading: false,
				error: message,
				activeCount: 0,
				disconnectedCount: 0,
				listCameras: [],
			});
			return { activeCount: 0, disconnectedCount: 0 };
		}
	},

	fetchAddDanhsachCamera: async (data: CameraRecord) => {
		set({ loading: true, error: null });
		try {
			await fetchAddDanhsachCameraItem(data as any);
			set({ loading: false, error: null });
		}
		catch (error) {
			const message
				= error instanceof Error ? error.message : "Lỗi khi thêm danh mục camera";
			set({ loading: false, error: message });
		}
	},
	fetchUpdateDanhsachCamera: async (id: number, data: CameraRecord) => {
		set({ loading: true, error: null });
		try {
			await fetchUpdateDanhsachCameraItem(id, data as any);
			set({ loading: false, error: null });
		}
		catch (error) {
			const message
				= error instanceof Error ? error.message : "Lỗi khi cập nhật danh mục camera";
			set({ loading: false, error: message });
		}
	},
	setTotalCameras: (totalCameras: number) => {
		set({ totalCameras });
	},

	incrementTotalCameras: (value = 1) => {
		set(state => ({ totalCameras: state.totalCameras + value }));
	},

	decrementTotalCameras: (value = 1) => {
		set(state => ({ totalCameras: Math.max(0, state.totalCameras - value) }));
	},

	reset: () => {
		set(initialState);
	},
}));
