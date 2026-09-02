import type { DanhsachCameraItemType } from "#src/api/camera/danhsach/types";
import type { TreeDataNodeWithId } from "#src/components/basic-form";
import {
	fetchAddDanhsachCameraItem,
	fetchDanhsachCamerasList,
	fetchUpdateDanhsachCameraItem,
} from "#src/api/camera/danhsach/index";
import { BasicButton } from "#src/components/basic-button";
import { useCameraStore } from "#src/store/camera/cameraStore";
import { useMutation } from "@tanstack/react-query";
import { Form, Input, Modal, Switch } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// Helper function to normalize boolean value
function normalizeBoolean(value: unknown): boolean {
	if (value === undefined || value === null)
		return true;
	if (typeof value === "boolean")
		return value;
	if (typeof value === "number")
		return value === 1;
	if (typeof value === "string")
		return value.toLowerCase() === "true" || value === "1";
	return Boolean(value);
}

interface DetailProps {
	treeData?: TreeDataNodeWithId[]
	title: React.ReactNode
	open: boolean
	detailData: Partial<DanhsachCameraItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<DanhsachCameraItemType>();

	const { mutateAsync: addCamera, isPending: isAdding } = useMutation({
		mutationFn: fetchAddDanhsachCameraItem,
	});

	const { mutateAsync: updateCamera, isPending: isUpdating } = useMutation({
		mutationFn: (data: DanhsachCameraItemType) => fetchUpdateDanhsachCameraItem(data.id!, data),
	});

	const isLoading = isAdding || isUpdating;

	const validateUniqueIp = async (_: unknown, value: string) => {
		const ip = (value || "").trim();
		if (!ip) {
			return Promise.reject(new Error(t("camera.ipRequired") || "IP address is required"));
		}

		const cameras = await fetchDanhsachCamerasList();
		const duplicate = cameras.some(
			camera => camera.ip_address === ip && camera.id !== detailData.id,
		);

		if (duplicate) {
			return Promise.reject(new Error(t("camera.ipDuplicate") || "IP address already exists"));
		}

		return Promise.resolve();
	};

	const handleCancel = () => {
		form.resetFields();
		onCloseChange();
	};

	const onFinish = async (values: DanhsachCameraItemType) => {
		try {
			if (detailData.id) {
				const { last_check, ...updateData } = values;

				await updateCamera({
					...updateData,
					id: detailData.id,
					is_online: detailData.is_online,
					last_check: detailData.last_check || "",
				} as DanhsachCameraItemType);

				window.$message?.success(t("common.updateSuccess"));
			}
			else {
				await addCamera({
					...values,
					is_online: values.is_online ?? true,
				});

				await Promise.all([
					useCameraStore.getState().fetchTotalCameras(),
					useCameraStore.getState().fetchCameraSummary(),
				]);

				window.$message?.success(t("common.addSuccess"));
			}

			refreshTable?.();
			handleCancel();
		}
		catch (error) {
			console.error("Failed to submit camera form:", error);
		}
	};

	useEffect(() => {
		if (open) {
			if (detailData.id) {
				form.setFieldsValue({
					...detailData,
					is_online: normalizeBoolean(detailData.is_online),
				} as DanhsachCameraItemType);
			}
			else {
				form.resetFields();
				form.setFieldsValue({ is_online: true } as Partial<DanhsachCameraItemType>);
			}
		}
	}, [open, detailData, form]);

	return (
		<Modal
			title={title}
			open={open}
			onCancel={handleCancel}
			destroyOnClose
			width={600}
			footer={null}
		>
			<Form form={form} layout="vertical" onFinish={onFinish} preserve={false}>
				<Form.Item label={t("camera.khuVuc")} name="name">
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

				<Form.Item label={t("camera.location")} name="location">
					<Input />
				</Form.Item>

				<Form.Item
					label={t("camera.status")}
					name="is_online"
					valuePropName="checked"
					initialValue={true}
				>
					<Switch
						checkedChildren={t("common.enabled")}
						unCheckedChildren={t("common.deactivated")}
					/>
				</Form.Item>

				<Form.Item label={t("camera.last_check")} name="last_check">
					<Input
						disabled
						placeholder={detailData.last_check || t("camera.neverScanned") || "Never scanned"}
					/>
				</Form.Item>

				<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
					<BasicButton onClick={handleCancel} disabled={isLoading}>
						{t("common.cancel")}
					</BasicButton>
					<BasicButton type="primary" htmlType="submit" loading={isLoading}>
						{t("common.save")}
					</BasicButton>
				</div>
			</Form>
		</Modal>
	);
}
