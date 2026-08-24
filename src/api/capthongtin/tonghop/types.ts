export interface TonghopThietbiThongtinItemType {
	id: number
	thiet_bi_id: number
	ten_thiet_bi: string
	don_vi_id: number
	ten_don_vi: string
	vi_tri_id: number
	ten_vi_tri: string
	khu_vuc_id: number
	ten_khu_vuc: string
	don_vi_tinh_id: number
	ten_don_vi_tinh: string
	so_luong: number
	loai_thiet_bi_id: number
	ten_loai: string
	ngay_lap: string | null
	trang_thai: boolean | null
	tinh_trang?: boolean | null
	ghi_chu: string
	created_at: string
	updated_at: string
}
