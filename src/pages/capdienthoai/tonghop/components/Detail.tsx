import type { Dayjs } from "dayjs";
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { TonghopOptions } from "../types";
import {
	ModalForm,
	ProFormDatePicker,
	ProFormDigit,
	ProFormSelect,
	ProFormSwitch,
	ProFormTextArea,
} from "@ant-design/pro-components";
import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchAddTonghopThietbiThongtin, fetchUpdateTonghopThietbiThongtin } from "#src/api/capthongtin/tonghop/index";

type TonghopbienapFormType = Omit<TonghopThietbiThongtinItemType, "ngay_lap"> & {
	ngay_lap?: Dayjs
};
interface Props {
	title: React.ReactNode
	open: boolean
	detailData: Partial<TonghopThietbiThongtinItemType>
	options: TonghopOptions
	onCloseChange: () => void
	refreshTable?: () => void
}

function Detail({
	title,
	open,
	detailData,
	options,
	onCloseChange,
	refreshTable,
}: Props) {
	const { t } = useTranslation();
	const [form] = Form.useForm<TonghopbienapFormType>();
	const onFinish = async (values: TonghopbienapFormType) => {
		try {
			if (!values.ngay_lap) {
				window.$message?.error(t("form.required"));
				return false;
			}

			let ngayLapStr: string;
			if (typeof values.ngay_lap === "string") {
				ngayLapStr = values.ngay_lap;
			}
			else if (values.ngay_lap && typeof (values.ngay_lap as any).format === "function") {
				ngayLapStr = (values.ngay_lap as any).format("YYYY-MM-DD");
			}
			else {
				window.$message?.error("Ngày lắp không hợp lệ");
				return false;
			}

			const normalizedValues: TonghopThietbiThongtinItemType = {
				...values,
				ngay_lap: ngayLapStr,
			};
			const payload: TonghopThietbiThongtinItemType = detailData.id ? { ...detailData, ...normalizedValues } : normalizedValues;
			if (detailData.id) {
				await fetchUpdateTonghopThietbiThongtin(detailData.id, payload);
				window.$message?.success(t("common.updateSuccess"));
			}
			else {
				await fetchAddTonghopThietbiThongtin(payload);
				window.$message?.success(t("common.addSuccess"));
			}
			refreshTable?.();
			onCloseChange();
			return true;
		}
		catch (error) {
			console.error("Save error:", error);
			window.$message?.error((error as any)?.message || t("common.saveFailed"));
			return false;
		}
	};

	useEffect(() => {
		if (open) {
			form.setFieldsValue({
				thiet_bi_id: detailData?.thiet_bi_id,
				don_vi_id: detailData?.don_vi_id,
				vi_tri_id: detailData?.vi_tri_id,
				khu_vuc_id: detailData.khu_vuc_id,
				don_vi_tinh_id: detailData.don_vi_tinh_id,
				so_luong: detailData.so_luong ?? 1,
				loai_thiet_bi_id: detailData.loai_thiet_bi_id,
				ngay_lap: detailData.ngay_lap ? dayjs(detailData.ngay_lap) : undefined,
				tinh_trang: detailData?.tinh_trang ?? false,
				ghi_chu: detailData?.ghi_chu,
			});
		}
		else {
			form.resetFields();
		}
	}, [open, detailData, form]);

	return (
		<ModalForm<TonghopbienapFormType>
			title={title}
			open={open}
			onOpenChange={(visible) => {
				if (!visible)
					onCloseChange();
			}}
			labelCol={{ md: 6, xl: 4 }}
			layout="horizontal"
			form={form}
			autoFocusFirstInput
			modalProps={{ destroyOnHidden: true }}
			width={600}
			onFinish={onFinish}
		>
			<ProFormSelect
				name="thiet_bi_id"
				label="Tên thiết bị"
				placeholder="Chọn thiết bị"
				options={options.thietBi}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSelect
				name="don_vi_id"
				label="Đơn vị"
				placeholder="Chọn đơn vị"
				options={options.donVi}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSelect
				name="vi_tri_id"
				label="Vị trí lắp đặt"
				placeholder="Chọn vị trí"
				options={options.viTriLapDat}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSelect
				name="khu_vuc_id"
				label="Khu vực"
				placeholder="Chọn khu vực"
				options={options.khuVuc}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSelect
				name="don_vi_tinh_id"
				label="Đơn vị tính"
				placeholder="Chọn đơn vị tính"
				options={options.donViTinh}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>

			<ProFormDigit
				name="so_luong"
				label="Số lượng"
				min={1}
				max={100}
				placeholder="Nhập số lượng"
			/>
			<ProFormSelect
				name="loai_thiet_bi_id"
				label="Loại thiết bị"
				placeholder="Chọn loại thiết bị"
				options={options.loaiThietBi}
				fieldProps={{
					showSearch: true,
					optionFilterProp: "label",
				}}
				rules={[{ required: true, message: t("form.required") }]}
			/>

			<ProFormDatePicker
				name="ngay_lap"
				label="Ngày lắp"
				placeholder="Chọn ngày lắp"
				rules={[{ required: true, message: t("form.required") }]}
			/>
			<ProFormSwitch
				name="tinh_trang"
				label="TÌnh trạng thiết bị"
			/>
			<ProFormTextArea
				name="ghi_chu"
				label="Ghi chú"
				placeholder="Nhập ghi chú"
			/>
		</ModalForm>
	);
}

export default Detail;
