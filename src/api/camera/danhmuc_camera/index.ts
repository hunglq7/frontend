import type {
	DanhMucCameraCreateType,
	DanhMucCameraItemType,
} from "./types";
import { request } from "#src/utils/request";

export * from "./types";

/* Lấy danh sách danh mục camera */
export function fetchDanhMucCameraList() {
	return request
		.get<DanhMucCameraItemType[]>("api/danh-muc-camera", {
			ignoreLoading: true,
		})
		.json();
}

/* Thêm mới danh mục camera */
export function fetchAddDanhMucCameraItem(data: DanhMucCameraCreateType) {
	return request.post("api/danh-muc-camera", {
		json: data,
		ignoreLoading: true,
	});
}

/* Cập nhật danh mục camera */
export function fetchUpdateDanhMucCameraItem(
	id: number,
	data: Omit<DanhMucCameraItemType, "id">,
) {
	return request.put(`api/danh-muc-camera/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

/* Xóa một danh mục camera */
export function fetchDeleteDanhMucCameraItem(id: number) {
	return request.delete(`api/danh-muc-camera/${id}`, {
		ignoreLoading: true,
	});
}

/* Xóa nhiều danh mục camera */
export function fetchDeleteMultipleDanhMucCamera(ids: number[]) {
	return request.delete("api/danh-muc-camera", {
		json: { ids },
		ignoreLoading: true,
	});
}
