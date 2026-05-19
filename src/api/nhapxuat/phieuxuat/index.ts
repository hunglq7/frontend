import type { PhieuXuatItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchPhieuXuatList() {
	return request
		.get<PhieuXuatItemType[]>("api/phieu_xuat", {
			ignoreLoading: true,
		})
		.json();
}

export function fetchPhieuXuatById(id: number) {
	return request
		.get<PhieuXuatItemType>(`api/phieu_xuat/${id}`, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddPhieuXuatItem(
	data: Omit<PhieuXuatItemType, "id,ten_don_vi,ten_vi_tri">,
) {
	return request.post("api/phieu_xuat", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdatePhieuXuatItem(
	id: number,
	data: Omit<PhieuXuatItemType, "id,ten_don_vi,ten_vi_tri">,
) {
	return request.put(`api/phieu_xuat/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeletePhieuXuatItem(id: number) {
	return request.delete(`api/phieu_xuat/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultiplePhieuXuatItems(ids: number[]) {
	return request.delete("api/phieu_xuat", {
		json: { ids },
		ignoreLoading: true,
	});
}
