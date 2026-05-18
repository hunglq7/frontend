import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as XLSX from "xlsx";

interface Props {
	data: LoaiThietBiItemType[]
}

function LoaiThietBiExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên loại thiết bị": item.ten_loai,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên loại thiết bị"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "DanhMucLoaiThietBi");
		XLSX.writeFile(workbook, "danh-muc-loai-thiet-bi.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default LoaiThietBiExportExcel;
