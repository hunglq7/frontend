import type { TonghopThietbiThongtinItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchTonghopThietbiThongtinList() {
	return request
		.get<TonghopThietbiThongtinItemType[]>("api/chi_tiet_phieu_nhap", {
			ignoreLoading: true,
		})
		.json();
}

export function fetchTonghopThietbiThongtinById(id: number) {
	return request
		.get<TonghopThietbiThongtinItemType>(`api/chi_tiet_phieu_nhap/${id}`, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddTonghopThietbiThongtin(
	data: Omit<TonghopThietbiThongtinItemType, "id">,
) {
	return request.post("api/tonghop_thietbi_thongtin", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateTonghopThietbiThongtin(
	id: number,
	data: Omit<TonghopThietbiThongtinItemType, "id">,
) {
	return request.put(`api/tonghop_thietbi_thongtin/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteTonghopThietbiThongtinItem(id: number) {
	return request.delete(`api/tonghop_thietbi_thongtin/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultipleTonghopThietbiThongtinItems(ids: number[]) {
	return request.delete("api/tonghop_thietbi_thongtin", {
		json: { ids },
		ignoreLoading: true,
	});
}
