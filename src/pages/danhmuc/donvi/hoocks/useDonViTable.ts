import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import { message } from "antd";
import { useEffect, useState } from "react";

import {
	fetchAddDanhMucDonViItem,
	fetchDanhMucDonViList,
	fetchDeleteDanhMucDonViItem,
	fetchDeleteMultipleDanhMucDonViItems,
	fetchUpdateDanhMucDonViItem,
} from "#src/api/danhmuc/donvi";

export default function useDonViTable() {
	const [dataSource, setDataSource] = useState<DanhMucDonViItemType[]>([]);
	const [editableKeys, setEditableKeys] = useState<React.Key[]>([]);
	const [selectedRows, setSelectedRows] = useState<DanhMucDonViItemType[]>([]);

	// load data
	const fetchData = async () => {
		const data = await fetchDanhMucDonViList();
		setDataSource(data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	// save
	const handleSave = async (row: DanhMucDonViItemType) => {
		try {
			if (row.id > 0) {
				await fetchUpdateDanhMucDonViItem(row.id, row);
				message.success("Cập nhật thành công");
			}
			else {
				await fetchAddDanhMucDonViItem({
					...row,
				});
				message.success("Thêm mới thành công");
			}

			await fetchData();
		}
		catch (error) {
			console.error("Lỗi khi gọi hàm handleSave");
			message.error(`Lưu thất bại ${error}`);
		}
	};

	// delete one

	const handleDelete = async (id: number) => {
		try {
			await fetchDeleteDanhMucDonViItem(id);
			message.success("Xóa thành công");
			await fetchData();
		}
		catch (error) {
			console.error("Lỗi khi gọi hàm handleDelete");
			message.error(`Xóa thất bại ${error}`);
		}
	};

	// delete multiple

	const handleDeleteMultiple = async () => {
		try {
			const ids = selectedRows.map(item => item.id);
			if (!ids.length) {
				message.warning("Vui lòng chọn dữ liệu");
				return;
			}

			await fetchDeleteMultipleDanhMucDonViItems(ids);
			message.success("Xóa nhiều thành công");
			setSelectedRows([]);
			await fetchData();
		}
		catch (error) {
			console.error("Lỗi khi gọi hàm handleDeleteMutiple");
			message.error(`Xóa nhiều thất bại ${error}`);
		}
	};

	return {
		dataSource,
		setDataSource,
		editableKeys,
		setEditableKeys,
		selectedRows,
		setSelectedRows,
		handleSave,
		handleDelete,
		handleDeleteMultiple,
	};
}
