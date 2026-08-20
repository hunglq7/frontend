import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import * as XLSX from "xlsx";

interface Props {
	data: DonViTinhItemType[]
}

function DonViTinhExportExcel({ data }: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên đơn vị tính": item.ten_don_vi_tinh,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên đơn vị tính"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "DanhMucDonViTinh");
		XLSX.writeFile(workbook, "danh-muc-don-vi-tinh.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default DonViTinhExportExcel;
