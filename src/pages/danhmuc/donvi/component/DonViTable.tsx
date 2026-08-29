import type { DanhMucDonViItemType as DonViItem } from "#src/api/danhmuc/donvi/types";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
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

	const pendingNewRowKeyRef = useRef<React.Key | null>(null);

	// search state
	const [searchText, setSearchText] = useState("");
	const [currentPage, setCurrentPage] = useState(1);

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

	useEffect(() => {
		if (!pendingNewRowKeyRef.current) {
			return;
		}

		const focusEditableRow = () => {
			const rowSelector = `[data-row-key="${String(pendingNewRowKeyRef.current)}"]`;
			const rowElement = document.querySelector(rowSelector) as HTMLElement | null;
			if (!rowElement) {
				return;
			}

			rowElement.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});

			const input = rowElement.querySelector("input, textarea, .ant-select-selector") as HTMLElement | null;
			input?.focus();
			pendingNewRowKeyRef.current = null;
		};

		requestAnimationFrame(focusEditableRow);
	}, [editableKeys, dataSource]);

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
				current: currentPage,
				pageSize: 10,
				showSizeChanger: true,
				onChange: (page) => {
					setCurrentPage(page);
				},
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
						pendingNewRowKeyRef.current = tempId;
						setCurrentPage(1);
						setDataSource(prev => [newRow, ...prev]);
						setEditableKeys(prev => [...prev, tempId]);
					}}
					onDeleteMultiple={handleDeleteMultiple}
				/>,
			]}

			editable={{
				type: "multiple",
				editableKeys,
				onChange: setEditableKeys,
				onCancel: async (key, row) => {
					const rowId = row?.id ?? key;
					if (typeof rowId === "number" && rowId < 0) {
						setDataSource(prev => prev.filter(item => item.id !== rowId));
						setEditableKeys(prev => prev.filter(item => item !== key));
						if (pendingNewRowKeyRef.current === rowId) {
							pendingNewRowKeyRef.current = null;
						}
					}
				},
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
