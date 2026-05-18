import type { ActionType } from "@ant-design/pro-components";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { LoaiThietBiColumns } from "../components/LoaiThietBiColumns";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	dataSource: LoaiThietBiItemType[]
	loading: boolean
	request: any
	onEdit: (record: LoaiThietBiItemType) => void
	onDelete: (id: number) => void | Promise<void>
	rowSelection: any
	toolbar: React.ReactNode
}
function LoaiThietBiTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
}: Props) {
	const columns = LoaiThietBiColumns({
		onEdit,
		onDelete,
	});

	return (
		<ProTable<LoaiThietBiItemType>
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

export default LoaiThietBiTable;
