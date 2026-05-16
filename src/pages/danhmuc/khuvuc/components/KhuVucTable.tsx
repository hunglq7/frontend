import type { ActionType } from "@ant-design/pro-components";
import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types.js";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { KhuVucColumns } from "../components/KhuVucColumns";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	dataSource: KhuVucItemType[]
	loading: boolean
	request: any
	onEdit: (record: KhuVucItemType) => void
	onDelete: (id: number) => void | Promise<void>
	rowSelection: any
	toolbar: React.ReactNode
}
function KhuVucTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
}: Props) {
	const columns = KhuVucColumns({
		onEdit,
		onDelete,
	});

	return (
		<ProTable<KhuVucItemType>
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

export default KhuVucTable;
