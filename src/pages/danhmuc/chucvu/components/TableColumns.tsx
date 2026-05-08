import type { ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { TFunction } from "i18next";
import type { DanhMucChucVuItemType } from "#src/api/danhmuc/chucvu/types.js";
import { SaveOutlined } from "@ant-design/icons";
import { Input, Popconfirm } from "antd";

import { BasicButton } from "#src/components/basic-button";

interface TableColumnsProps {
	editingId: number | null
	editingValue: string
	setEditingValue: (value: string) => void
	setEditingId: (id: number | null) => void
	handleSaveEdit: () => void
	handleStartEdit: (record: DanhMucChucVuItemType) => void
	handleDeleteRow: (id: number, action?: ProCoreActionType<object>) => void
	t: TFunction
}

export function getTableColumns({
	editingId,
	editingValue,
	setEditingValue,
	setEditingId,
	handleSaveEdit,
	handleStartEdit,
	handleDeleteRow,
	t,
}: TableColumnsProps): ProColumns<DanhMucChucVuItemType>[] {
	return [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 80,
			sorter: true,
		},
		{
			title: t("danhmuc.tenChucVu") || "Tên chức vụ",
			dataIndex: "ten_chuc_vu",
			key: "ten_chuc_vu",
			width: 260,
			sorter: true,
			render: (text, record) => {
				if (editingId === record.id) {
					return (
						<Input
							value={editingValue}
							onChange={e => setEditingValue(e.target.value)}
							autoFocus
						/>
					);
				}
				return text;
			},
		},
		{
			title: t("common.action") || "Thao tác",
			valueType: "option",
			key: "option",
			width: 220,
			fixed: "right",
			render: (_, record, __, action) => {
				if (editingId === record.id) {
					return [
						<BasicButton
							key="save"
							type="primary"
							size="small"
							icon={<SaveOutlined />}
							onClick={handleSaveEdit}
						>
							{t("common.save") || "Lưu"}
						</BasicButton>,
						<BasicButton
							key="cancel"
							size="small"
							onClick={() => {
								setEditingId(null);
								setEditingValue("");
							}}
						>
							{t("common.cancel") || "Hủy"}
						</BasicButton>,
					];
				}
				return [
					<BasicButton
						key="editable"
						type="link"
						size="small"
						onClick={() => handleStartEdit(record)}
					>
						{t("common.edit") || "Sửa"}
					</BasicButton>,
					<Popconfirm
						key="delete"
						title={t("common.confirmDelete") || "Xác nhận xóa?"}
						onConfirm={() => handleDeleteRow(record.id!, action)}
						okText={t("common.confirm") || "Xác nhận"}
						cancelText={t("common.cancel") || "Hủy"}
					>
						<BasicButton type="link" size="small" danger>
							{t("common.delete") || "Xóa"}
						</BasicButton>
					</Popconfirm>,
				];
			},
		},
	];
}
