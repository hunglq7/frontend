import type { ThietBiItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchThietBiList() {
	return request
		.get<ThietBiItemType[]>("api/thiet-bi", {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddThietBiItem(data: Omit<ThietBiItemType, "id">) {
	return request.post("api/thiet-bi", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateThietBiItem(
	id: number,
	data: Omit<ThietBiItemType, "id">,
) {
	return request.put(`api/thiet-bi/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteThietBiItem(id: number) {
	return request.delete(`api/thiet-bi/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultipleThietBiItems(ids: number[]) {
	return request.delete("api/thiet-bi", {
		json: { ids },
		ignoreLoading: true,
	});
}
