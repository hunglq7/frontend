import type { DanhMucChucVuItemType as ChucvuItem } from "#src/api/danhmuc/chucvu/types.js";
import type { ActionType } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { ChucVuColumns } from "../components/ChucvuColumns";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	dataSource: ChucvuItem[]
	loading: boolean
	request: any
	onEdit: (record: ChucvuItem) => void

	onDelete: (id: number) => void | Promise<void>

	rowSelection: any

	toolbar: React.ReactNode
}
function ChucvuTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
}: Props) {
	const columns = ChucVuColumns({
		onEdit,
		onDelete,
	});

	return (
		<ProTable<ChucvuItem>
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

export default ChucvuTable;
