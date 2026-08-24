/* cspell:disable */
import type { TonghopThietbiThongtinItemType } from "#src/api/capthongtin/tonghop/types";
import type { DanhMucDonViItemType } from "#src/api/danhmuc/donvi/types";
import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types";
import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types";
import type { ThietBiItemType } from "#src/api/danhmuc/thietbi/types";
import {
	ModalForm,
	ProFormSelect,
	ProFormText,
} from "@ant-design/pro-components";
import { useMemo } from "react";

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: any) => Promise<boolean>
	initialValues?: TonghopThietbiThongtinItemType | null
	thietBiList: ThietBiItemType[]
	loaiThietBiList: LoaiThietBiItemType[]
	donViTinhList: DonViTinhItemType[]
	danhMucDonViList: DanhMucDonViItemType[]
}

function TonghopThietbiThongtinModal({
	open,
	onOpenChange,
	onSubmit,
	initialValues,
	loaiThietBiList,
	thietBiList,
	donViTinhList,
	danhMucDonViList,
}: Props) {
	const toOptions = <T extends { id: number }>(
		items: T[],
		getLabel: (item: T) => string,
	) => items.map(item => ({ label: getLabel(item), value: Number(item.id) }));
	const findId = <T extends { id: number }>(
		id: number | undefined,
		label: string | undefined,
		items: T[],
		getLabel: (item: T) => string,
	) => {
		if (id != null) {
			return Number(id);
		}
		return items.find(item => getLabel(item) === label)?.id;
	};

	const normalizedInitialValues = useMemo(() => {
		if (!initialValues)
			return {};
		return {
			...initialValues,
			thiet_bi_id: findId(
				initialValues.thiet_bi_id,
				initialValues.ten_thiet_bi,
				thietBiList,
				item => item.ten_thiet_bi,
			),
			loai_thiet_bi_id: findId(
				initialValues.loai_thiet_bi_id,
				initialValues.ten_loai,
				loaiThietBiList,
				item => item.ten_loai,
			),
			don_vi_tinh_id: findId(
				initialValues.don_vi_tinh_id,
				initialValues.ten_don_vi_tinh,
				donViTinhList,
				item => item.ten_don_vi_tinh,
			),
			don_vi_id: findId(
				initialValues.don_vi_id,
				initialValues.ten_don_vi,
				danhMucDonViList,
				item => item.ten_don_vi,
			),
		};
	}, [initialValues, thietBiList, loaiThietBiList, donViTinhList, danhMucDonViList]);

	// Cấu hình danh sách các trường Select
	const selectFields = [
		{
			name: "thiet_bi_id",
			label: "Thiết bị",
			options: useMemo(() => toOptions(thietBiList, item => item.ten_thiet_bi), [thietBiList]),
		},
		{
			name: "don_vi_id",
			label: "Đơn vị",
			options: useMemo(() => toOptions(danhMucDonViList, item => item.ten_don_vi), [danhMucDonViList]),
		},
		{
			name: "loai_thiet_bi_id",
			label: "Loại thiết bị",
			options: useMemo(() => toOptions(loaiThietBiList, item => item.ten_loai), [loaiThietBiList]),
		},
		{
			name: "don_vi_tinh_id",
			label: "Đơn vị tính",
			options: useMemo(() => toOptions(donViTinhList, item => item.ten_don_vi_tinh), [donViTinhList]),
		},

	];
	return (
		<ModalForm
			key={initialValues?.id ?? "new"}
			title={
				initialValues
					? "Cập nhật thiết bị"
					: "Thêm thiết bị"
			}
			open={open}
			onOpenChange={onOpenChange}
			initialValues={normalizedInitialValues}
			modalProps={{
				destroyOnHidden: true,
			}}
			onFinish={onSubmit}
			layout="horizontal"
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
		>
			{selectFields.map(({ name, label, options }) => (
				<ProFormSelect
					key={name}
					name={name}
					label={label}
					placeholder={`Chọn ${label.toLowerCase()}`}
					options={options}
					rules={[{ required: true, message: `Vui lòng chọn ${label.toLowerCase()}` }]}
				/>
			))}

			<ProFormText
				name="so_luong"
				label="Số lượng"
				placeholder="Nhập số lượng"
			/>

		</ModalForm>
	);
}

export default TonghopThietbiThongtinModal;
