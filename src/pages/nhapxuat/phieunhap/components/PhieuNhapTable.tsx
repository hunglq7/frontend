import type { ActionType } from "@ant-design/pro-components";
import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/types.js";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { PhieuNhapColumns } from "../components/PhieuNhapColumns";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	dataSource: PhieuNhapItemType[]
	loading: boolean
	request: any
	onEdit: (record: PhieuNhapItemType) => void
	onDelete: (id: number) => void | Promise<void>
	rowSelection: any
	toolbar: React.ReactNode
}
function PhieuNhapTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
}: Props) {
	const columns = PhieuNhapColumns({
		onEdit,
		onDelete,
	});

	return (
		<ProTable<PhieuNhapItemType>
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

export default PhieuNhapTable;
