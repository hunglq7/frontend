import type { DanhmucCameraItemType } from "./types";
import { useAuthStore } from "#src/store/auth";
import { request } from "#src/utils/request";

export * from "./types";

/* Lấy danh sách danh mục camera */
export function fetchDanhmucCamerasList() {
	return request
		.get<DanhmucCameraItemType[]>("cameras", {
			ignoreLoading: true,
		})
		.json()
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error("fetchDanhmucCamerasList error:", error);
			throw error;
		});
}

/* Thêm mới danh mục camera */
export function fetchAddDanhMucCameraItem(
	data: Omit<DanhmucCameraItemType, "id">,
) {
	return request.post("cameras", {
		json: data,
		ignoreLoading: true,
	});
}

/* Cập nhật danh mục camera */
export function fetchUpdateDanhMucCameraItem(
	id: number,
	data: Omit<DanhmucCameraItemType, "id">,
) {
	return request.put(`cameras/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export interface ScanCameraResult {
	is_online: boolean;
}

export function fetchScanDanhMucCameraItem(id: number) {
	return request
		.put<ScanCameraResult>(`cameras/${id}/scan`, {
			ignoreLoading: true,
			timeout: 20000,
			retry: 0,
		})
		.json();
}

/* Xóa một danh mục camera */
export function fetchDeleteDanhMucCameraItem(id: number) {
	return request.delete(`cameras/${id}`, { ignoreLoading: true });
}

/* Xóa nhiều danh mục camera */
export function fetchDeleteMultipleDanhMucCameraItems(ids: number[]) {
	return request.delete("cameras", {
		json: { ids },
		ignoreLoading: true,
	});
}

export function fetchImportDanhMucCamera(file: File) {
	const formData = new FormData();
	formData.append("upload_file", file);
	return fetch(`${import.meta.env.VITE_API_BASE_URL}cameras/import`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${useAuthStore.getState().token}`,
		},
		body: formData,
	}).then((response) => {
		if (!response.ok) {
			return response.text().then((text) => {
				throw new Error(text || `Upload failed: ${response.status}`);
			});
		}
		return response.json();
	});
}

export function fetchDownloadDanhmucCameraTemplate() {
	return fetch(`${import.meta.env.VITE_API_BASE_URL}cameras/template`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${useAuthStore.getState().token}`,
		},
	}).then((response) => {
		if (!response.ok) {
			throw new Error(`Template download failed: ${response.status}`);
		}
		return response.blob();
	});
}
