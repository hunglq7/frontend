import type { TonghopCameraItemType } from "#src/api/camera/tonghop/types";
import type { ActionType, ProColumns, ProCoreActionType } from "@ant-design/pro-components";
import {
	fetchAddTonghopCameraItem,
	fetchDeleteTonghopCameraItem,
	fetchTonghopCamerasList,
	fetchUpdateTonghopCameraItem,
} from "#src/api/camera/tonghop/index";
import { BasicButton } from "#src/components/basic-button";
import { BasicContent } from "#src/components/basic-content";
import { BasicTable } from "#src/components/basic-table";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { Detail } from "./component/detail";
import { getConstantColumns } from "./constants";

export default function TonghopCamera() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [detailData, setDetailData] = useState<Partial<TonghopCameraItemType>>({});
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const actionRef = useRef<ActionType>(null);

	const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
		await fetchDeleteTonghopCameraItem(id);
		setSelectedRowKeys([]);
		await action?.reload?.();
		window.$message?.success(t("common.deleteSuccess"));
	};

	const handleExportExcel = async () => {
		try {
			const data = await fetchTonghopCamerasList();
			const exportData = data.map((item, index) => ({
				"STT": index + 1,
				"Camera ID": item.camera_id,
				"Total Scans": item.total_scans,
				"Summary": item.summary,
				"Last Updated": item.last_updated,
			}));
			const worksheet = XLSX.utils.json_to_sheet(exportData, {
				header: ["STT", "Camera ID", "Total Scans", "Summary", "Last Updated"],
			});
			worksheet["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 25 }];
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "TonghopCamera");
			XLSX.writeFile(workbook, "tonghop_camera.xlsx");
			window.$message?.success(t("common.exportSuccess"));
		}
		catch (error) {
			console.error("Export failed", error);
			window.$message?.error(t("common.exportFailed"));
		}
	};

	const handleAdd = async (values: TonghopCameraItemType) => {
		await fetchAddTonghopCameraItem({
			camera_id: values.camera_id,
			total_scans: values.total_scans,
			summary: values.summary,
		});
		await actionRef.current?.reload();
		window.$message?.success(t("common.addSuccess"));
	};

	const handleUpdate = async (values: TonghopCameraItemType) => {
		if (detailData.id) {
			await fetchUpdateTonghopCameraItem(detailData.id, {
				total_scans: values.total_scans,
				summary: values.summary,
			});
			await actionRef.current?.reload();
			window.$message?.success(t("common.updateSuccess"));
		}
	};

	const columns: ProColumns<TonghopCameraItemType>[] = [
		...getConstantColumns(t),
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 160,
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
					<BasicButton type="link" size="small" danger>
						{t("common.delete")}
					</BasicButton>
				</Popconfirm>,
			],
		},
	];

	return (
		<BasicContent>
			<BasicTable<TonghopCameraItemType>
				headerTitle={t("camera.tonghopcamera") || "Camera Summary"}
				actionRef={actionRef}
				rowKey="id"
				search={false}
				columns={columns}
				request={async () => {
					const data = await fetchTonghopCamerasList();
					return {
						data,
						success: true,
						total: data.length,
					};
				}}
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
				}}
				toolBarRender={() => [
					<BasicButton
						key="add"
						type="primary"
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setIsOpen(true);
							setTitle(t("common.add"));
							setDetailData({});
						}}
					>
						{t("common.add")}
					</BasicButton>,
					<Button key="export" onClick={handleExportExcel}>
						{t("common.export")}
					</Button>,
				]}
			/>

			<Detail
				open={isOpen}
				setOpen={setIsOpen}
				title={title}
				detailData={detailData}
				onFinish={detailData.id ? handleUpdate : handleAdd}
			/>
		</BasicContent>
	);
}
