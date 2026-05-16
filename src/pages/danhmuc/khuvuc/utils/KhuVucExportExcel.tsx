import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as XLSX from "xlsx";

interface Props {
	data: KhuVucItemType[]
}

function KhuVucExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên khu vực": item.ten_khu_vuc,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên khu vực"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "DanhMucKhuVuc");
		XLSX.writeFile(workbook, "danh-muc-khu-vuc.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default KhuVucExportExcel;
