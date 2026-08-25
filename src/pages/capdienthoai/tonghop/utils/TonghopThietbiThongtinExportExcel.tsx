import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

interface Props {
	data: TonghopThietbiThongtinItemType[]
}

function TonghopThietbiThongtinExportExcel({ data }: Props) {
	console.error("dữ liệu in", data);
	const handleExport = () => {
		const exportData = data.map((item, index) => ({
			"STT": index + 1,
			"Tên thiết bị": item.ten_thiet_bi,
			"Đơn vị": item.ten_don_vi,
			"Vị trí": item.ten_vi_tri,
			"Khu vực": item.ten_khu_vuc,
			"Đơn vị tính": item.ten_don_vi_tinh,
			"Số lượng": item.so_luong,
			"Loại thiết bị": item.ten_loai,
			"Ngày lắp": dayjs(item.ngay_lap).format("DD/MM/YYYY"),
			"Tình trạng": item.tinh_trang ? "Hoạt động" : "Ngưng hoạt động",
			"Ghi chú": item.ghi_chu,

		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData, {
			header: ["STT", "Tên thiết bị", "Đơn vị", "Vị trí", "Khu vực", "Đơn vị tính", "Số lượng", "Loại thiết bị", "Ngày lắp", "Tình trạng", "Ghi chú"],
		});
		worksheet["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 20 }];
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "TonghopThietbiThongtin");
		XLSX.writeFile(workbook, "tong-hop-thiet-bi-thong-tin.xlsx");
	};

	return (
		<Button icon={<DownloadOutlined />} onClick={handleExport}>
			Xuất Excel
		</Button>
	);
}

export default TonghopThietbiThongtinExportExcel;
