import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as XLSX from "xlsx";

interface Props {
	data: ThietBiItemType[]
}

function ThietbiExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên thiết bị": item.ten_thiet_bi,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên thiết bị"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "DanhMucThietBi");
		XLSX.writeFile(workbook, "danh-muc-thiet-bi.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default ThietbiExportExcel;
