import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types.js";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types.js";
import type { PhieuXuatItemType } from "#src/api/nhapxuat/phieuxuat/types.js";
import type { ActionType } from "@ant-design/pro-components";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { PhieuXuatColumns } from "../components/PhieuXuatColumns";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	dataSource: PhieuXuatItemType[]
	loading: boolean
	request: any
	onEdit: (record: PhieuXuatItemType) => void
	onDelete: (id: number) => void | Promise<void>
	rowSelection: any
	toolbar: React.ReactNode
	donViList: DanhMucDonViItemType[]
	viTriList: ViTriLapDatItemType[]
}
function PhieuXuatTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
	donViList,
	viTriList,
}: Props) {
	const columns = PhieuXuatColumns({
		onEdit,
		onDelete,
		donViList,
		viTriList,
	});

	return (
		<ProTable<PhieuXuatItemType>
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

export default PhieuXuatTable;
