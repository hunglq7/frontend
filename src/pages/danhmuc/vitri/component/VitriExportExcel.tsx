import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types.js";
import { BasicButton } from "#src/components/basic-button";
import * as XLSX from "xlsx";

interface Props {
	data: ViTriLapDatItemType[]
}
export default function VitriExportExcelButton({
	data,
}: Props) {
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên vị trí": item.ten_vi_tri,
		}));
		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên vị trí"],
		});
		worksheet["!cols"] = [{ wch: 6 }, { wch: 50 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(
			workbook,
			worksheet,
			"DanhMucViTriLapDat",
		);
		XLSX.writeFile(workbook, "danh_muc_vi_tri_lap_dat.xlsx");
	};

	return (
		<BasicButton
			onClick={handleExport}
		>
			Xuất Excel
		</BasicButton>
	);
}
