import type { DanhMucDonViItemType as DonViItem } from "#src/api/danhmuc/donvi/types";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useMemo, useState } from "react";
import useDonViTable from "../hoocks/useDonViTable";
import { createColumns } from "./columns";
import Toolbar from "./Toolbar";

export default function DonViTable() {
	const {
		dataSource,
		setDataSource,
		editableKeys,
		setEditableKeys,
		selectedRows,
		setSelectedRows,
		handleSave,
		handleDelete,
		handleDeleteMultiple,
	} = useDonViTable();

	// search state
	const [searchText, setSearchText] = useState("");

	// columns
	const columns = createColumns({
		handleDelete,
	});

	// filter data
	const filteredData = useMemo(() => {
		return dataSource.filter(item =>
			item.ten_don_vi?.toLowerCase().includes(searchText.toLowerCase()),
		);
	}, [dataSource, searchText]);

	return (
		<ProTable<DonViItem>
			rowKey="id"
			columns={columns}
			dataSource={filteredData}
			search={{
				labelWidth: "auto",
				optionRender: (_, props) => [
					<Button
						key="search"
						type="primary"
						icon={<SearchOutlined />}
						onClick={() => {
							const values = props.form?.getFieldsValue();
							setSearchText(values?.ten_don_vi || "");
						}}
					>
						Tìm
					</Button>,
					<Button
						key="reset"
						icon={<ClearOutlined />}
						onClick={() => {
							props.form?.resetFields();
							setSearchText("");
						}}
					>
						Đặt lại
					</Button>,
				],
			}}

			pagination={{
				pageSize: 10,
				showSizeChanger: true,
			}}
			rowSelection={{
				onChange: (_, rows) => {
					setSelectedRows(rows);
				},
			}}

			toolBarRender={() => [
				<Toolbar
					key="toolbar"
					data={filteredData}
					selectedCount={selectedRows.length}
					onAdd={() => {
						const tempId = -Date.now();
						const newRow = {
							id: tempId,
							ten_don_vi: "",
						};
						// add row
						setDataSource(prev => [newRow, ...prev]);
						// editable
						setEditableKeys(prev => [...prev, tempId]);
					}}
					onDeleteMultiple={handleDeleteMultiple}
				/>,
			]}

			editable={{
				type: "multiple",
				editableKeys,
				onChange: setEditableKeys,
				onSave: async (_, row) => {
					await handleSave(row);
				},
				actionRender: (row, config, defaultDom) => {
					return [defaultDom.save, defaultDom.cancel];
				},
			}}
		/>
	);
}
