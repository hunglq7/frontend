import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import { PlusCircleOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	fetchDeleteMultipleTonghopThietbiThongtinItems,
	fetchDeleteTonghopThietbiThongtinItem,
	fetchTonghopThietbiThongtinList,
} from "#src/api/capthongtin/tonghop/index";
import { fetchThietBiList } from "#src/api/danhmuc/thietbi/index";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";
import Detail from "./components/Detail";
import ExportExcel from "./components/ExportExcel";
import { getConstantColumns } from "./constants";

export default function DanhsachCameraPage() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const { hasAccessByCodes } = useAccess();
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<TonghopThietbiThongtinItemType>>({});
	const [filteredData, setFilteredData] = useState<TonghopThietbiThongtinItemType[]>([]);
	const [thietBiList, setThietBiList] = useState<Awaited<ReturnType<typeof fetchThietBiList>>>([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	useEffect(() => {
		fetchThietBiList().then(setThietBiList).catch((error) => {
			console.error("Failed to load device options:", error);
		});
	}, []);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteTonghopThietbiThongtinItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleBulkDelete = async () => {
		if (selectedRowKeys.length === 0) {
			return;
		}
		await fetchDeleteMultipleTonghopThietbiThongtinItems(selectedRowKeys as number[]);
		setSelectedRowKeys([]);
		await actionRef.current?.reload();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const filterThietbiCameras = (
		data: TonghopThietbiThongtinItemType[],
		thietBiId?: number | string,
	): TonghopThietbiThongtinItemType[] => data.filter((item) => {
		const matchesDevice = thietBiId === undefined || thietBiId === "" || String(item.thiet_bi_id) === String(thietBiId);
		return matchesDevice && Boolean(item.tinh_trang);
	});

	const handleClearFilters = (form?: { resetFields?: () => void, submit?: () => void }) => {
		form?.resetFields?.();
		form?.submit?.();
	};

	const columns: ProColumns<TonghopThietbiThongtinItemType>[] = [
		...getConstantColumns(t, thietBiList),
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 80,
			fixed: "right",
			render: (_, record, __, action) => [
				<BasicButton
					key="editable"
					type="link"
					size="small"
					onClick={() => {
						setIsOpen(true);
						setTitle(t("common.edit"));
						setDetailData(record);
						console.warn("detailData set to:", record);
					}}
				>
					{t("common.edit")}
				</BasicButton>,
				<Popconfirm
					key="delete"
					title={t("common.confirmDelete")}
					onConfirm={() => handleDeleteRow(record.id!, action)}
					okText={t("common.confirm")}
					cancelText={t("common.cancel")}
				>
					<BasicButton key="delete-btn" type="link" size="small" danger>
						{t("common.delete")}
					</BasicButton>
				</Popconfirm>,
			],
		},
	];
	const onCloseChange = () => {
		setIsOpen(false);
		setDetailData({});
	};

	const refreshTable = () => {
		actionRef.current?.reload();
	};

	return (
		<BasicContent className="h-full">
			<BasicTable<TonghopThietbiThongtinItemType>
				adaptive
				columns={columns}
				actionRef={actionRef}
				rowSelection={{
					selectedRowKeys,
					onChange: keys => setSelectedRowKeys(keys),
				}}
				tableAlertRender={({ selectedRowKeys }) => (
					<div>
						{t("common.selectedRows", { count: selectedRowKeys?.length ?? 0 })}
					</div>
				)}
				tableAlertOptionRender={({ onCleanSelected }) => (
					<Button type="link" onClick={onCleanSelected}>
						{t("common.cancelAll")}
					</Button>
				)}
				request={async (params) => {
					const data = await fetchTonghopThietbiThongtinList();
					const filtered = filterThietbiCameras(data, params.thiet_bi_id);
					setFilteredData(filtered);
					return {
						data: filtered,
						total: filtered.length,
					};
				}}
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
								handleClearFilters(props.form);
							}}
						>
							Đặt lại
						</Button>,
					],
				}}
				headerTitle={t("home.capnhatcamera")}
				toolBarRender={() => [
					<Button
						key="add-tonghopcamera"
						icon={<PlusCircleOutlined />}
						type="primary"
						disabled={!hasAccessByCodes(accessControlCodes.add)}
						onClick={() => {
							setIsOpen(true);
							setTitle(t("common.addThietbi"));
							setDetailData({});
						}}
					>
						{t("common.add")}
					</Button>,
					<ExportExcel key="export" data={filteredData} />,
					<Button
						key="bulk-delete"
						danger
						hidden={!hasAccessByCodes(accessControlCodes.delete) || selectedRowKeys.length === 0}
						onClick={handleBulkDelete}
					>
						{t("common.deleteSelect")}
					</Button>,
				]}
			/>
			<Detail
				title={title}
				open={isOpen}
				detailData={detailData}
				onCloseChange={onCloseChange}
				refreshTable={refreshTable}
			/>
		</BasicContent>
	);
}
