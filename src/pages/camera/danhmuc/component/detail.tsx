import type { DanhmucCameraItemType } from "#src/api/camera/danhmuc/types";
import type { TreeDataNodeWithId } from "#src/components/basic-form";
import { useMutation } from "@tanstack/react-query";
import { Drawer, Form, Input, Radio } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchAddDanhMucCameraItem, fetchDanhmucCamerasList, fetchUpdateDanhMucCameraItem } from "#src/api/camera/danhmuc/index";
import { BasicButton } from "#src/components/basic-button";

interface DetailProps {
	treeData: TreeDataNodeWithId[]
	title: React.ReactNode
	open: boolean
	detailData: Partial<DanhmucCameraItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, treeData: _treeData, refreshTable }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<DanhmucCameraItemType>();

	const addCameraItemMutation = useMutation({
		mutationFn: fetchAddDanhMucCameraItem,
	});

	const updateDanhMucCameraItemMutation = useMutation({
		mutationFn: (data: DanhmucCameraItemType) => fetchUpdateDanhMucCameraItem(data.id!, data),
	});

	const validateUniqueIp = async (_: any, value: string) => {
		const ip = (value || "").trim();
		if (!ip) {
			return Promise.reject(new Error(t("camera.ipRequired") || "IP address is required"));
		}

		const cameras = await fetchDanhmucCamerasList();
		const duplicate = cameras.some(camera => camera.ip_address === ip && camera.id !== detailData.id);
		if (duplicate) {
			return Promise.reject(new Error(t("camera.ipDuplicate") || "IP address already exists"));
		}

		return Promise.resolve();
	};

	const onFinish = async (values: DanhmucCameraItemType) => {
		if (detailData.id) {
			const updateData = { ...values, id: detailData.id };
			await updateDanhMucCameraItemMutation.mutateAsync(updateData);
			window.$message?.success(t("common.updateSuccess"));
		}
		else {
			await addCameraItemMutation.mutateAsync(values);
			window.$message?.success(t("common.addSuccess"));
		}

		refreshTable?.();
		return true;
	};

	useEffect(() => {
		if (open) {
			console.warn("Form opened, detailData:", detailData);
			form.resetFields();
			if (detailData.id) {
				console.warn("Setting form values for edit:", detailData);
				form.setFieldsValue(detailData as DanhmucCameraItemType);
				console.warn("Form values after setFieldsValue:", form.getFieldsValue());
			}
			else {
				console.warn("Setting form values for add");
				form.setFieldsValue({ is_online: true } as Partial<DanhmucCameraItemType>);
			}
		}
	}, [open, detailData, form]);

	return (
		<Drawer
			key={`drawer-${detailData.id || "new"}`}
			title={title}
			open={open}
			onClose={() => {
				form.resetFields();
				onCloseChange();
			}}
			width={600}
			destroyOnClose
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
			>
				<Form.Item
					label={t("camera.tenThietBi")}
					name="name"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label={t("camera.ipAddress")}
					name="ip_address"
					rules={[
						{ required: true, message: t("camera.ipRequired") || "IP address is required" },
						{ validator: validateUniqueIp },
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label={t("camera.location")}
					name="location"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label={t("camera.status")}
					name="is_online"
				>
					<Radio.Group>
						<Radio value={true}>{t("common.enabled")}</Radio>
						<Radio value={false}>{t("common.deactivated")}</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item
					label={t("camera.last_check")}
					name="last_check"
				>
					<Input />
				</Form.Item>

				<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
					<BasicButton onClick={() => {
						form.resetFields();
						onCloseChange();
					}}
					>
						{t("common.cancel")}
					</BasicButton>
					<BasicButton type="primary" htmlType="submit">
						{t("common.save")}
					</BasicButton>
				</div>
			</Form>
		</Drawer>
	);
}
