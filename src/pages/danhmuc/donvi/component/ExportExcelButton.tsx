import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types.js";
import { BasicButton } from "#src/components/basic-button";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

interface Props {
	data: DanhMucDonViItemType[]
}

export default function ExportExcelButton({
	data,
}: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên đơn vị": item.ten_don_vi,
		}));
		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên đơn vị"],
		});
		worksheet["!cols"] = [{ wch: 6 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(
			workbook,
			worksheet,
			"DanhMucDonVi",
		);

		XLSX.writeFile(workbook, "danh_muc_don_vi.xlsx");
	};

	return (
		<BasicButton
			size="small"
			icon={<DownloadOutlined />}
			onClick={handleExport}
		>
			Xuất Excel
		</BasicButton>
	);
}
