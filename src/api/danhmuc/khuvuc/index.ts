import type { KhuVucItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

/* Lấy danh sách khu vực */
export function fetchKhuVucList() {
	return request
		.get<KhuVucItemType[]>("api/khu-vuc", {
			ignoreLoading: true,
		})
		.json();
}

/* Thêm mới khu vực */
export function fetchAddKhuVucItem(data: Omit<KhuVucItemType, "id">) {
	return request.post("api/khu-vuc", {
		json: data,
		ignoreLoading: true,
	});
}

/* Cập nhật khu vực */
export function fetchUpdateKhuVucItem(
	id: number,
	data: Partial<KhuVucItemType>,
) {
	return request.put(`api/khu-vuc/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

/* Xóa một khu vực */
export function fetchDeleteKhuVucItem(id: number) {
	return request.delete(`api/khu-vuc/${id}`, {
		ignoreLoading: true,
	});
}

/* Xóa nhiều khu vực */
export function fetchDeleteMultipleKhuVucItems(ids: number[]) {
	return request.delete("api/khu-vuc", {
		json: { ids },
		ignoreLoading: true,
	});
}
