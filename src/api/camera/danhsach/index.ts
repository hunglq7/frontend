import type { DanhsachCameraItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

// Helper to normalize is_online to boolean (database may return 0/1)
// Default to true if not specified
function normalizeCamera(camera: any): DanhsachCameraItemType {
	let isOnline = true; // Default to true

	if (camera.is_online === undefined || camera.is_online === null) {
		isOnline = true;
	}
	else if (typeof camera.is_online === "boolean") {
		isOnline = camera.is_online;
	}
	else if (typeof camera.is_online === "number") {
		isOnline = camera.is_online === 1 || camera.is_online > 0;
	}
	else if (typeof camera.is_online === "string") {
		isOnline = camera.is_online.toLowerCase() === "true" || camera.is_online === "1";
	}

	const normalized = {
		...camera,
		is_online: isOnline,
	};
	return normalized;
}

function normalizeCameras(cameras: any[]): DanhsachCameraItemType[] {
	return cameras.map(normalizeCamera);
}

/* Lấy danh sách danh mục camera */
export function fetchDanhsachCamerasList() {
	return request
		.get<DanhsachCameraItemType[]>("cameras", {
			ignoreLoading: true,
		})
		.json()
		.then((data) => {
			return normalizeCameras(data);
		})
		.catch((error) => {
			console.error("fetchDanhsachCamerasList error:", error);
			throw error;
		});
}

export function fetchTotalDanhsachCameras() {
	return request
		.get<{ total: number }>("cameras/total", {
			ignoreLoading: true,
		})
		.json()
		.then((data) => {
			return data.total;
		})
		.catch((error) => {
			console.error("fetchTotalDanhsachCameras error:", error);
			throw error;
		});
}

/* Thêm mới danh mục camera */
export function fetchAddDanhsachCameraItem(
	data: Omit<DanhsachCameraItemType, "id">,
) {
	return request.post<DanhsachCameraItemType>("cameras", {
		json: data,
		ignoreLoading: true,
	})
		.json()
		.then(normalizeCamera)
		.catch((error) => {
			console.error("fetchAddDanhsachCameraItem error:", error);
			throw error;
		});
}

/* Cập nhật danh mục camera */
export function fetchUpdateDanhsachCameraItem(
	id: number,
	data: Omit<DanhsachCameraItemType, "id">,
) {
	// Exclude last_check as it's system-managed and should only be updated during scan operations
	const { last_check, ...updateData } = data;
	return request.put<DanhsachCameraItemType>(`cameras/${id}`, {
		json: updateData,
		ignoreLoading: true,
	})
		.json()
		.then(normalizeCamera)
		.catch((error) => {
			console.error("fetchUpdateDanhsachCameraItem error:", error);
			throw error;
		});
}

export interface ScanCameraResult {
	is_online: boolean
}

export function fetchScanDanhsachCameraItem(id: number) {
	return request
		.put<ScanCameraResult>(`cameras/${id}/scan`, {
			ignoreLoading: true,
			timeout: 20000,
			retry: 0,
		})
		.json();
}

export interface CheckStatusResult {
	message?: string
}

/* Xóa một danh mục camera */
export function fetchDeleteDanhsachCameraItem(id: number) {
	return request.delete(`cameras/${id}`, { ignoreLoading: true });
}

/* Xóa nhiều danh mục camera */
export function fetchDeleteMultipleDanhsachCameraItems(ids: number[]) {
	return request.delete("cameras", {
		json: { ids },
		ignoreLoading: true,
	});
}

export function fetchImportDanhsachCamera(file: File) {
	const formData = new FormData();
	formData.append("upload_file", file);
	return request
		.post("cameras/import", {
			body: formData,
			ignoreLoading: true,
		})
		.json();
}

export function fetchCheckStatusDanhsachCamera(file: File) {
	const formData = new FormData();
	formData.append("upload_file", file);
	return request
		.post("cameras/check-status", {
			body: formData,
			ignoreLoading: true,
			timeout: 20000,
			retry: 0,
		})
		.json<CheckStatusResult>();
}

export function fetchDownloadDanhsachCameraTemplate() {
	return request
		.get("cameras/template", {
			ignoreLoading: true,
		})
		.blob();
}
