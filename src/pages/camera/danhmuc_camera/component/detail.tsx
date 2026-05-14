import type { DanhMucCameraItemType } from "#src/api/camera/danhmuc_camera/types";
import { fetchAddDanhMucCameraItem, fetchUpdateDanhMucCameraItem } from "#src/api/camera/danhmuc_camera/index";
import { BasicButton } from "#src/components/basic-button";
import { useMutation } from "@tanstack/react-query";
import { Drawer, Form, Input } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DetailProps {
	title: React.ReactNode
	open: boolean
	detailData: Partial<DanhMucCameraItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

export function Detail({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<DanhMucCameraItemType>();

	const addCameraItemMutation = useMutation({
		mutationFn: fetchAddDanhMucCameraItem,
	});

	const updateDanhMucCameraItemMutation = useMutation({
		mutationFn: (data: DanhMucCameraItemType) => fetchUpdateDanhMucCameraItem({
			id: data.id!,
			...data,
		}),
	});

	const onFinish = async (values: DanhMucCameraItemType) => {
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
		onCloseChange();
		return true;
	};

	useEffect(() => {
		if (open) {
			form.resetFields();
			if (detailData.id) {
				form.setFieldsValue(detailData as DanhMucCameraItemType);
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
			size={600}
			destroyOnHidden
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
			>
				<Form.Item
					label={t("danhmuc.tenThietBi")}
					name="ten_thiet_bi"
					rules={[{ required: true, message: t("danhmuc.tenThietBiRequired") || "Tên thiết bị là bắt buộc" }]}
				>
					<Input placeholder={t("danhmuc.tenThietBiPlaceholder") || "Nhập tên thiết bị"} />
				</Form.Item>

				<Form.Item
					label={t("danhmuc.thongSoKyThuat")}
					name="thong_so_ky_thuat"
					rules={[{ required: true, message: t("danhmuc.thongSoKyThuatRequired") || "Thông số kỹ thuật là bắt buộc" }]}
				>
					<Input.TextArea
						rows={3}
						placeholder={t("danhmuc.thongSoKyThuatPlaceholder") || "Nhập thông số kỹ thuật"}
					/>
				</Form.Item>

				<Form.Item
					label={t("danhmuc.hangSanXuat")}
					name="hang_san_xuat"
					rules={[{ required: true, message: t("danhmuc.hangSanXuatRequired") || "Hãng sản xuất là bắt buộc" }]}
				>
					<Input placeholder={t("danhmuc.hangSanXuatPlaceholder") || "Nhập hãng sản xuất"} />
				</Form.Item>

				<Form.Item
					label={t("danhmuc.nuocSanXuat")}
					name="nuoc_san_xuat"
					rules={[{ required: true, message: t("danhmuc.nuocSanXuatRequired") || "Nước sản xuất là bắt buộc" }]}
				>
					<Input placeholder={t("danhmuc.nuocSanXuatPlaceholder") || "Nhập nước sản xuất"} />
				</Form.Item>

				<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "24px" }}>
					<BasicButton onClick={onCloseChange}>
						{t("common.cancel")}
					</BasicButton>
					<BasicButton
						type="primary"
						htmlType="submit"
						loading={addCameraItemMutation.isPending || updateDanhMucCameraItemMutation.isPending}
					>
						{t("common.save")}
					</BasicButton>
				</div>
			</Form>
		</Drawer>
	);
}
