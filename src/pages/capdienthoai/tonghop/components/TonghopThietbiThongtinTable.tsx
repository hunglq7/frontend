/* cspell:disable */
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types";
import type { KhuVucItemType } from "#src/api/danhmuc/khuvuc/types";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types";
import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types";
import type { ActionType } from "@ant-design/pro-components";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { TonghopThietbiThongtinColumns } from "../components/TonghopThietbiThongtinColumns";

interface Props {
	actionRef: React.RefObject<ActionType | null>
	loading?: boolean
	request: any
	onEdit: (record: TonghopThietbiThongtinItemType) => void
	onDelete: (id: number | undefined) => void | Promise<void>
	rowSelection: any
	toolbar: React.ReactNode
	loaiThietBiList: LoaiThietBiItemType[]
	donViTinhList: DonViTinhItemType[]
	thietBiList: ThietBiItemType[]
	danhMucDonViList: DanhMucDonViItemType[]
	viTriList: ViTriLapDatItemType[]
	khuVucList: KhuVucItemType[]
}
function TonghopThietbiThongtinTable({
	actionRef,
	request,
	onEdit,
	onDelete,
	rowSelection,
	toolbar,
	loaiThietBiList,
	donViTinhList,
	thietBiList,
	danhMucDonViList,
	viTriList,
	khuVucList,
}: Props) {
	const columns = TonghopThietbiThongtinColumns({
		onEdit,
		onDelete,
		loaiThietBiList,
		donViTinhList,
		thietBiList,
		danhMucDonViList,
		viTriList,
		khuVucList,
	});

	return (
		<ProTable<TonghopThietbiThongtinItemType>
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

export default TonghopThietbiThongtinTable;
