import type { Dayjs } from "dayjs";
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchAddTonghopThietbiThongtin, fetchUpdateTonghopThietbiThongtin } from "#src/api/capthongtin/tonghop/index";
import { fetchDanhMucDonViList } from "#src/api/danhmuc/donvi/index";
import { fetchDonViTinhList } from "#src/api/danhmuc/donvitinh/index";
import { fetchKhuVucList } from "#src/api/danhmuc/khuvuc/index";
import { fetchLoaiThietBiList } from "#src/api/danhmuc/loaithietbi/index";
import { fetchThietBiList } from "#src/api/danhmuc/thietbi/index";
import { fetchViTriLapDatList } from "#src/api/danhmuc/vitri/index";

type TonghopbienapFormType = Omit<TonghopThietbiThongtinItemType, "ngay_lap"> & {
	ngay_lap?: Dayjs
};
interface Props {
	title: React.ReactNode
	open: boolean
	detailData: Partial<TonghopThietbiThongtinItemType>
	onCloseChange: () => void
	refreshTable?: () => void
}

function Detail({
	title,
	open,
	detailData,
	onCloseChange,
	refreshTable,
}: Props) {
	const { t } = useTranslation();
	const [form] = Form.useForm<TonghopbienapFormType>();
	const [phongbanOptions, setPhongbanOptions] = useState<{ label: string, value: number }[]>([]);
	const [donvitinhOptions, setDonvitinhOptions] = useState<{ label: string, value: number }[]>([]);
	const [khuvucOptions, setKhuvucOptions] = useState<{ label: string, value: number }[]>([]);
	const [loaithietbiOptions, setLoaithietbiOptions] = useState<{ label: string, value: number }[]>([]);
	const [thietbiOptions, setThietbiOptions] = useState<{ label: string, value: number }[]>([]);
	const [vitrilapdatOptions, setVitrilapdatOptions] = useState<{ label: string, value: number }[]>([]);
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
		const loadOptions = async () => {
			try {
				const [phongbanOptions, donvitinhOptions, khuvucOptions, loaithietbiOptions, thietbiOptions, vitrilapdatOptions] = await Promise.all([
					fetchDanhMucDonViList(),
					fetchDonViTinhList (),
					fetchKhuVucList (),
					fetchLoaiThietBiList(),
					fetchThietBiList (),
					fetchViTriLapDatList (),
				]);

				setDonvitinhOptions(donvitinhOptions.map(item => ({ label: item.ten_don_vi_tinh, value: item.id ?? 0 })));
				setPhongbanOptions(phongbanOptions.map(item => ({ label: item.ten_don_vi, value: item.id ?? 0 })));
				setKhuvucOptions(khuvucOptions.map(item => ({ label: item.ten_khu_vuc, value: item.id ?? 0 })));
				setLoaithietbiOptions(loaithietbiOptions.map(item => ({ label: item.ten_loai, value: item.id ?? 0 })));
				setThietbiOptions(thietbiOptions.map(item => ({ label: item.ten_thiet_bi, value: item.id ?? 0 })));
				setVitrilapdatOptions(vitrilapdatOptions.map(item => ({ label: item.ten_vi_tri, value: item.id ?? 0 })));
			}
			catch (error) {
				console.error("Lỗi khi tải danh sách options:", error);
			}
		};

		loadOptions();

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
				trang_thai: detailData.trang_thai ?? false,
				tinh_trang: detailData?.tinh_trang ?? false,
				ghi_chu: detailData?.ghi_chu,
			});
		}
		else {
			form.resetFields();
		}
	}, [open, detailData]);

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
				options={thietbiOptions}
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
				options={phongbanOptions}
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
				options={vitrilapdatOptions}
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
				options={khuvucOptions}
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
				options={donvitinhOptions}
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
				options={loaithietbiOptions}
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
				name="trang_thai"
				label="Trạng thái"
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
