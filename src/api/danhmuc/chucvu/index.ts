import type { DanhMucChucVuItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchDanhMucChucVuList() {
	return request
		.get<DanhMucChucVuItemType[]>("api/danh-muc-chuc-vu", {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddDanhMucChucVuItem(
	data: Omit<DanhMucChucVuItemType, "id">,
) {
	return request.post("api/danh-muc-chuc-vu", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateDanhMucChucVuItem(
	id: number,
	data: Omit<DanhMucChucVuItemType, "id">,
) {
	return request.put(`api/danh-muc-chuc-vu/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteDanhMucChucVuItem(id: number) {
	return request.delete(`api/danh-muc-chuc-vu/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultipleDanhMucChucVuItems(ids: number[]) {
	return request.delete("api/danh-muc-chuc-vu", {
		json: { ids },
		ignoreLoading: true,
	});
}
