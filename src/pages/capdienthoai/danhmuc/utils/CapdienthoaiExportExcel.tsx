import type { DanhMucCapDienThoaiItemType } from "#src/api/capthongtin/danhmuc/index.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as XLSX from "xlsx";

interface Props {
	data: DanhMucCapDienThoaiItemType[]
}

function CapdienthoaiExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên thiết bị": item.tenCap,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên thiết bị"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "DanhCapdienthoai");
		XLSX.writeFile(workbook, "danh-muc-cap-dien-thoai.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default CapdienthoaiExportExcel;
