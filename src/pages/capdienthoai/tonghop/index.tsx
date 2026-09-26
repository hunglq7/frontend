import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { TonghopSearchValues } from "./components/SearchForm";
import type { TonghopOptions } from "./types";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	fetchDeleteMultipleTonghopThietbiThongtinItems,
	fetchDeleteTonghopThietbiThongtinItem,
	fetchTonghopThietbiThongtinList,
} from "#src/api/capthongtin/tonghop/index";
import { fetchDanhMucDonViList } from "#src/api/danhmuc/donvi/index";
import { fetchDonViTinhList } from "#src/api/danhmuc/donvitinh/index";
import { fetchKhuVucList } from "#src/api/danhmuc/khuvuc/index";
import { fetchLoaiThietBiList } from "#src/api/danhmuc/loaithietbi/index";
import { fetchThietBiList } from "#src/api/danhmuc/thietbi/index";
import { fetchViTriLapDatList } from "#src/api/danhmuc/vitri/index";

import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { accessControlCodes, useAccess } from "#src/hooks/use-access";
import Detail from "./components/Detail";
import ExportExcel from "./components/ExportExcel";
import SearchForm from "./components/SearchForm";
import { getConstantColumns } from "./constants";

const emptyOptions: TonghopOptions = {
	thietBi: [],
	donVi: [],
	donViTinh: [],
	khuVuc: [],
	loaiThietBi: [],
	viTriLapDat: [],
};

export default function TonghopCameraPage() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const { hasAccessByCodes } = useAccess();
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<TonghopThietbiThongtinItemType>>({});
	const [filteredData, setFilteredData] = useState<TonghopThietbiThongtinItemType[]>([]);
	const [options, setOptions] = useState<TonghopOptions>(emptyOptions);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);
	const searchFiltersRef = useRef<TonghopSearchValues>({});

	useEffect(() => {
		let isMounted = true;
		const loadOptions = async () => {
			try {
				const [donVi, donViTinh, khuVuc, loaiThietBi, thietBi, viTriLapDat] = await Promise.all([
					fetchDanhMucDonViList(),
					fetchDonViTinhList(),
					fetchKhuVucList(),
					fetchLoaiThietBiList(),
					fetchThietBiList(),
					fetchViTriLapDatList(),
				]);

				if (isMounted) {
					setOptions({
						donVi: donVi.map(item => ({ label: item.ten_don_vi, value: item.id ?? 0 })),
						donViTinh: donViTinh.map(item => ({ label: item.ten_don_vi_tinh, value: item.id ?? 0 })),
						khuVuc: khuVuc.map(item => ({ label: item.ten_khu_vuc, value: item.id ?? 0 })),
						loaiThietBi: loaiThietBi.map(item => ({ label: item.ten_loai, value: item.id ?? 0 })),
						thietBi: thietBi.map(item => ({ label: item.ten_thiet_bi, value: item.id ?? 0 })),
						viTriLapDat: viTriLapDat.map(item => ({ label: item.ten_vi_tri, value: item.id ?? 0 })),
					});
				}
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách options:", error);
			}
		};

		void loadOptions();
		return () => {
			isMounted = false;
		};
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

	const handleSearch = (values: TonghopSearchValues) => {
		searchFiltersRef.current = values;
		void actionRef.current?.reload();
	};

	const handleResetFilters = () => {
		searchFiltersRef.current = {};
		void actionRef.current?.reload();
	};

	const columns: ProColumns<TonghopThietbiThongtinItemType>[] = [
		...getConstantColumns(t, options),
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

			<SearchForm options={options} onSearch={handleSearch} onReset={handleResetFilters} />
			<BasicTable<TonghopThietbiThongtinItemType>
				adaptive
				columns={columns}
				search={false}
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
				request={async () => {
					const data = await fetchTonghopThietbiThongtinList();
					const filters = searchFiltersRef.current;
					const matchesId = (itemId: number | undefined, selectedId: number | string | undefined) =>
						selectedId === undefined || selectedId === null || selectedId === "" || String(itemId) === String(selectedId);
					let filtered = data.filter(item =>
						matchesId(item.thiet_bi_id, filters.thiet_bi_id)
						&& matchesId(item.don_vi_id, filters.don_vi_id)
						&& matchesId(item.vi_tri_id, filters.vi_tri_id)
						&& matchesId(item.khu_vuc_id, filters.khu_vuc_id),
					);
					if (filters.ngay_lap) {
						const selectedDate = dayjs(filters.ngay_lap);
						if (selectedDate.isValid()) {
							filtered = filtered.filter(item => item.ngay_lap && dayjs(item.ngay_lap).isSame(selectedDate, "day"));
						}
					}
					setFilteredData(filtered);
					return {
						data: filtered,
						success: true,
						total: filtered.length,
					};
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
				options={options}
				onCloseChange={onCloseChange}
				refreshTable={refreshTable}
			/>
		</BasicContent>
	);
}
