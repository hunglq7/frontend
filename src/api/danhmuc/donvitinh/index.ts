import type { DonViTinhItemType } from "./types.js";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchDonViTinhList() {
	return request
		.get<DonViTinhItemType[]>("api/don_vi_tinh", {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddDonViTinhItem(data: Omit<DonViTinhItemType, "id">) {
	return request.post("api/don_vi_tinh", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateDonViTinhItem(
	id: number,
	data: Omit<DonViTinhItemType, "id">,
) {
	return request.put(`api/don_vi_tinh/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteDonViTinhItem(id: number) {
	return request.delete(`api/don_vi_tinh/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultipleDonViTinhItems(ids: number[]) {
	return request.delete("api/don_vi_tinh", {
		json: { ids },
		ignoreLoading: true,
	});
}
