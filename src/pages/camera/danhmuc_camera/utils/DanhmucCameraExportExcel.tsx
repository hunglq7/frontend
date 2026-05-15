import type { DanhMucCameraItemType } from "#src/api/camera/danhmuc_camera/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as XLSX from "xlsx";

interface Props {
	data: DanhMucCameraItemType[]
}

function DanhMucCameraExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên thiết bị": item.ten_thiet_bi,
			"Thông số kỹ thuật": item.thong_so_ky_thuat,
			"Hãng sản xuất": item.hang_san_xuat,
			"Nước sản xuất": item.nuoc_san_xuat,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên thiết bị", "Thông số kỹ thuật", "Hãng sản xuất", "Nước sản xuất"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 50 }, { wch: 20 }, { wch: 20 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "DanhMucCamera");
		XLSX.writeFile(workbook, "danh-muc-camera.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default DanhMucCameraExportExcel;
