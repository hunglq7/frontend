import type { ActionType } from "@ant-design/pro-components";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types.js";
import { ProTable } from "@ant-design/pro-components";
import { ThietBiColumns } from "../components/ThietbiColumns";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	dataSource: ThietBiItemType[]
	loading: boolean
	request: any
	onEdit: (record: ThietBiItemType) => void
	onDelete: (id: number) => void | Promise<void>
	rowSelection: any
	toolbar: React.ReactNode
}
function ThietbiTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
}: Props) {
	const columns = ThietBiColumns({
		onEdit,
		onDelete,
	});

	return (
		<ProTable<ThietBiItemType>
			rowKey="id"
			actionRef={actionRef}
			columns={columns}
			request={request}
			rowSelection={rowSelection}
			search={{
				labelWidth: 120,
			}}
			pagination={{
				pageSize: 10,
			}}
			toolBarRender={() => [toolbar]}
		/>
	);
}

export default ThietbiTable;
