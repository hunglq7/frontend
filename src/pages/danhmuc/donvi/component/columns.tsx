import type { ProColumns } from "@ant-design/pro-components";
import type { DanhMucDonViItemType as DonViItem } from "#src/api/danhmuc/donvi/types.js";
import { Popconfirm } from "antd";
import { BasicButton } from "#src/components/basic-button";

interface Props {
	handleDelete: (id: number) => void
}

export function createColumns({
	handleDelete,
}: Props): ProColumns<DonViItem>[] {
	return [
		{
			title: "STT",
			dataIndex: "stt",
			width: 100,
			editable: false,
			search: false,
			render: (_, __, index) => index + 1,
		},

		{
			title: "Tên đơn vị",
			dataIndex: "ten_don_vi",
			formItemProps: {
				rules: [
					{
						required: true,
						message: "Vui lòng nhập tên đơn vị",
					},
				],
			},
		},

		{
			title: "Hành động",
			valueType: "option",
			width: 200,
			render: (_, record, __, action) => [
				<BasicButton
					key="save"
					color="cyan"
					variant="text"
					size="small"
					onClick={() => {
						action?.startEditable?.(record.id);
					}}
				>
					Sửa
				</BasicButton>,

				<Popconfirm
					key="delete"
					title="Bạn có chắc muốn xóa?"
					onConfirm={() => handleDelete(record.id)}
				>
					<BasicButton size="small" variant="text" color="red">
						Xóa
					</BasicButton>
				</Popconfirm>,
			],
		},
	];
}
