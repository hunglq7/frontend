import type { ChiTietPhieuNhapItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

export function fetchChiTietPhieuNhapList() {
	return request
		.get<ChiTietPhieuNhapItemType[]>("api/chi_tiet_phieu_nhap", {
			ignoreLoading: true,
		})
		.json();
}

export function fetchChiTietPhieuNhapById(id: number) {
	return request
		.get<ChiTietPhieuNhapItemType>(`api/chi_tiet_phieu_nhap/${id}`, {
			ignoreLoading: true,
		})
		.json();
}

export function fetchAddChiTietPhieuNhapItem(
	data: Omit<ChiTietPhieuNhapItemType, "id,ma_phieu_nhap,ten_thiet_bi,ten_loai,ten_don_vi_tinh,thanh_tien">,
) {
	return request.post("api/chi_tiet_phieu_nhap", {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchUpdateChiTietPhieuNhapItem(
	id: number,
	data: Omit<ChiTietPhieuNhapItemType, "id,ma_phieu_nhap,ten_thiet_bi,ten_loai,ten_don_vi_tinh,thanh_tien">,
) {
	return request.put(`api/chi_tiet_phieu_nhap/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

export function fetchDeleteChiTietPhieuNhapItem(id: number) {
	return request.delete(`api/chi_tiet_phieu_nhap/${id}`, {
		ignoreLoading: true,
	});
}

export function fetchDeleteMultipleChiTietPhieuNhapItems(ids: number[]) {
	return request.delete("api/chi_tiet_phieu_nhap", {
		json: { ids },
		ignoreLoading: true,
	});
}
