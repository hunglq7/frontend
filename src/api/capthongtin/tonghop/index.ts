/* cspell:disable */
import type { TonghopThietbiThongtinItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

const TONGHOP_THIETBI_THONGTIN_ENDPOINT = "api/tonghop_hethong_thongtin";

export function fetchTonghopThietbiThongtinList() {
	return request
		.get<TonghopThietbiThongtinItemType[]>(TONGHOP_THIETBI_THONGTIN_ENDPOINT, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchTonghopThietbiThongtinById(id: number) {
	return request
		.get<TonghopThietbiThongtinItemType>(`${TONGHOP_THIETBI_THONGTIN_ENDPOINT}/${id}`, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddTonghopThietbiThongtin(
	data: Omit<TonghopThietbiThongtinItemType, "id">,
) {
	return request.post(TONGHOP_THIETBI_THONGTIN_ENDPOINT, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateTonghopThietbiThongtin(
	id: number,
	data: Omit<TonghopThietbiThongtinItemType, "id">,
) {
	return request.put(`${TONGHOP_THIETBI_THONGTIN_ENDPOINT}/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteTonghopThietbiThongtinItem(id: number) {
	return request.delete(`${TONGHOP_THIETBI_THONGTIN_ENDPOINT}/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultipleTonghopThietbiThongtinItems(ids: number[]) {
	return request.delete(TONGHOP_THIETBI_THONGTIN_ENDPOINT, {
		json: { ids },
		ignoreLoading: true,
	});
}
