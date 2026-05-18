import type { LoaiThietBiItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchLoaiThietBiList() {
	return request
		.get<LoaiThietBiItemType[]>("api/loai_thiet_bi", {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddLoaiThietBiItem(data: Omit<LoaiThietBiItemType, "id">) {
	return request.post("api/loai_thiet_bi", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateLoaiThietBiItem(
	id: number,
	data: Omit<LoaiThietBiItemType, "id">,
) {
	return request.put(`api/loai_thiet_bi/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteLoaiThietBiItem(id: number) {
	return request.delete(`api/loai_thiet_bi/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultipleLoaiThietBiItems(ids: number[]) {
	return request.delete("api/loai_thiet_bi", {
		json: { ids },
		ignoreLoading: true,
	});
}
