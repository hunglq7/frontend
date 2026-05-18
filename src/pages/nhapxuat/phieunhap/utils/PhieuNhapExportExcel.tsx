import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as XLSX from "xlsx";

interface Props {
	data: PhieuNhapItemType[]
}

function PhieuNhapExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Mã phiếu nhập": item.ma_phieu_nhap,
			"Ngày nhập": item.ngay_nhap,
			"Tên đơn vị": item.ten_don_vi,
			"Người nhập": item.nguoi_nhap,
			"Ghi chú": item.ghi_chu,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Mã phiếu nhập,", "Ngày nhập", "Tên đơn vị", "Người nhập", "Ghi chú"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 50 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "PhieuNhap");
		XLSX.writeFile(workbook, "phieu-nhap.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default PhieuNhapExportExcel;
