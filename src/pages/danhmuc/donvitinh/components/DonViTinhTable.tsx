import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import type { ActionType } from "@ant-design/pro-components";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { DonViTinhColumns } from "../components/DonViTinhColumns";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	dataSource: DonViTinhItemType[]
	loading: boolean
	request: any
	onEdit: (record: DonViTinhItemType) => void
	onDelete: (id: number) => void | Promise<void>
	rowSelection: any
	toolbar: React.ReactNode
}
function DonViTinhTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
}: Props) {
	const columns = DonViTinhColumns({
		onEdit,
		onDelete,
	});

	return (
		<ProTable<DonViTinhItemType>
			rowKey="id"
			actionRef={actionRef}
			columns={columns}
			request={request}
			rowSelection={rowSelection}
			search={{
				labelWidth: 120,
				optionRender: (_, props) => [
					<Button
						key="search"
						type="primary"
						size="middle"
						icon={<SearchOutlined />}
						onClick={() => props.form?.submit()}
					>
						Tìm
					</Button>,
					<Button
						key="reset"
						size="middle"
						icon={<ReloadOutlined />}
						onClick={() => {
							props.form?.resetFields();
							props.form?.submit();
						}}
					>
						Đặt lại
					</Button>,
				],
			}}
			pagination={{
				pageSize: 10,
			}}
			toolBarRender={() => [toolbar]}
		/>
	);
}

export default DonViTinhTable;
