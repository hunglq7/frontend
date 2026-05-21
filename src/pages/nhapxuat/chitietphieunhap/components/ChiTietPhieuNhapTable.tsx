import type { ActionType } from "@ant-design/pro-components";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types.js";
import type { ChiTietPhieuNhapItemType } from "#src/api/nhapxuat/chitietphieunhap/types.js";
import type { PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/types.js";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { ChiTietPhieuNhapColumns } from "../components/ChiTietPhieuNhapColumn";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	dataSource: ChiTietPhieuNhapItemType[]
	loading: boolean
	request: any
	onEdit: (record: ChiTietPhieuNhapItemType) => void
	onDelete: (id: number) => void | Promise<void>
	rowSelection: any
	toolbar: React.ReactNode
	phieuNhapList: PhieuNhapItemType[]
	loaiThietBiList: LoaiThietBiItemType[]
	viTriLapDatList: ViTriLapDatItemType[]
	donViTinhList: DonViTinhItemType[]
}
function ChiTietPhieuNhapTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
	phieuNhapList,
	loaiThietBiList,
	viTriLapDatList,
	donViTinhList,
}: Props) {
	const columns = ChiTietPhieuNhapColumns({
		onEdit,
		onDelete,
		phieuNhapList,
		loaiThietBiList,
		viTriLapDatList,
		donViTinhList,
	});

	return (
		<ProTable<ChiTietPhieuNhapItemType>
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

export default ChiTietPhieuNhapTable;
