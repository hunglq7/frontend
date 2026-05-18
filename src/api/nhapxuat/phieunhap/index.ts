import type { PhieuNhapItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchPhieuNhapList() {
	return request
		.get<PhieuNhapItemType[]>("api/phieu_nhap", {
			ignoreLoading: true,
		})
		.json();
}

export function fetchPhieuNhapById(id: number) {
	return request
		.get<PhieuNhapItemType>(`api/phieu_nhap/${id}`, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddPhieuNhapItem(
	data: Omit<PhieuNhapItemType, "id,ten_don_vi">,
) {
	return request.post("api/phieu_nhap", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdatePhieuNhapItem(
	id: number,
	data: Omit<PhieuNhapItemType, "id,ten_don_vi">,
) {
	return request.put(`api/phieu_nhap/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeletePhieuNhapItem(id: number) {
	return request.delete(`api/phieu_nhap/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultiplePhieuNhapItems(ids: number[]) {
	return request.delete("api/phieu_nhap", {
		json: { ids },
		ignoreLoading: true,
	});
}
