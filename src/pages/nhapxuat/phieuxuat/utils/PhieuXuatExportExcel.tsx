import type { PhieuXuatItemType } from "#src/api/nhapxuat/phieuxuat/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

interface Props {
	data: PhieuXuatItemType[]
}

function PhieuXuatExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Mã phiếu xuất": item.ma_phieu_xuat,
			"Ngày xuất": dayjs(item.ngay_xuat).format("DD/MM/YYYY"),
			"Tên đơn vị": item.ten_don_vi,
			"Vị trí lắp đặt": item.ten_vi_tri,
			"Người xuất": item.nguoi_xuat,
			"Ghi chú": item.ghi_chu,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Mã phiếu xuất", "Ngày xuất", "Tên đơn vị", "Vị trí lắp đặt", "Người xuất", "Ghi chú"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "PhieuXuat");
		XLSX.writeFile(workbook, "phieu-xuat.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default PhieuXuatExportExcel;
