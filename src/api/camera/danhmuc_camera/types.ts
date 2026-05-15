export interface DanhMucCameraItemType {
	id: number
	ten_thiet_bi: string
	thong_so_ky_thuat: string
	hang_san_xuat: string
	nuoc_san_xuat: string
}

export interface DanhMucCameraCreateType {
	ten_thiet_bi: string
	thong_so_ky_thuat: string
	hang_san_xuat: string
	nuoc_san_xuat: string
}

export interface DanhMucCameraUpdateType {
	id: number
	ten_thiet_bi?: string
	thong_so_ky_thuat?: string
	hang_san_xuat?: string
	nuoc_san_xuat?: string
}
