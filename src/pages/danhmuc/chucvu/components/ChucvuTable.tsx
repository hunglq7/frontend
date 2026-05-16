import type { DanhMucChucVuItemType as ChucvuItem } from "#src/api/danhmuc/chucvu/types.js";
import type { ActionType } from "@ant-design/pro-components";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
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

export default ChucvuTable;
