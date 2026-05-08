import type { DanhMucDonViItemType } from "./types";
import { request } from "#src/utils/request";

export * from "./types";

/* Lấy danh sách danh mục đơn vị */
export function fetchDanhMucDonViList() {
	return request
		.get<DanhMucDonViItemType[]>("api/danh-muc-don-vi", {
			ignoreLoading: true,
		})
		.json();
}

/* Thêm mới danh mục đơn vị */
export function fetchAddDanhMucDonViItem(
	data: Omit<DanhMucDonViItemType, "id">,
) {
	return request.post("api/danh-muc-don-vi", {
		json: data,
		ignoreLoading: true,
	});
}

/* Cập nhật danh mục đơn vị */
export function fetchUpdateDanhMucDonViItem(
	id: number,
	data: Omit<DanhMucDonViItemType, "id">,
) {
	return request.put(`api/danh-muc-don-vi/${id}`, {
		json: data,
		ignoreLoading: true,
	});
}

/* Xóa một danh mục đơn vị */
export function fetchDeleteDanhMucDonViItem(id: number) {
	return request.delete(`api/danh-muc-don-vi/${id}`, { ignoreLoading: true });
}

/* Xóa nhiều danh mục đơn vị */
export function fetchDeleteMultipleDanhMucDonViItems(ids: number[]) {
	return request.delete("api/danh-muc-don-vi", {
		json: { ids },
		ignoreLoading: true,
	});
}
