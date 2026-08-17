import type { ChiTietPhieuNhapItemType } from "#src/api/nhapxuat/chitietphieunhap/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as XLSX from "xlsx";

interface Props {
	data: ChiTietPhieuNhapItemType[]
}

function ChiTietPhieuNhapExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Mã phiếu nhập": item.ma_phieu_nhap,
			"Tên thiết bị": item.ten_thiet_bi,
			"Loại thiết bị": item.ten_loai,
			"Đơn vị tính": item.ten_don_vi_tinh,
			"Số lượng": item.so_luong,
			"Đơn giá": item.don_gia,
			"Thành tiền": item.thanh_tien,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Mã phiếu nhập", "Tên thiết bị", "Loại thiết bị", "Đơn vị tính", "Số lượng", "Đơn giá", "Thành tiền"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "ChiTietPhieuNhap");
		XLSX.writeFile(workbook, "chi-tiet-phieu-nhap.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default ChiTietPhieuNhapExportExcel;
