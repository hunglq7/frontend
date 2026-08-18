import type { DanhMucCapDienThoaiItemType } from "#src/api/capthongtin/danhmuc/types";
import { request } from "#src/utils/request";

export * from "./types";
export function fetchDanhmuccapdienthoaiList() {
	return request
		.get<DanhMucCapDienThoaiItemType[]>("api/danhMucCapDienThoai", { ignoreLoading: true })
		.json()
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error("Lấy dach sách thất bại", error);
			throw error;
		});
}

export function fetchCreateDanhmuccapdienthoai(data: Omit<DanhMucCapDienThoaiItemType, "id">) {
	return request
		.post("api/danhMucCapDienThoai", {
			json: data,
			ignoreLoading: true,
		});
}

export function fetchUpdateDanhmuccapdienthoai(id: number, data: Partial<DanhMucCapDienThoaiItemType>) {
	return request
		.put(`api/danhMucCapDienThoai/${id}`, {
			json: data,
			ignoreLoading: true,
		});
}

export function fetchDeleteDanhmuccapdienthoai(id: number) {
	return request
		.delete(`api/danhMucCapDienThoai/${id}`, {
			ignoreLoading: true,
		});
}

export function fetchDeleteMutipleDanhmuccapdienthoai(ids: number[]) {
	return request
		.delete("api/danhMucCapDienThoai", {
			json: { ids },
			ignoreLoading: true,
		});
}
