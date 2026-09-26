import type { Dayjs } from "dayjs";
import type { TonghopOptions } from "../types";
import { DownOutlined, ReloadOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Select } from "antd";
import { useState } from "react";

export interface TonghopSearchValues {
	thiet_bi_id?: number | string
	don_vi_id?: number | string
	vi_tri_id?: number | string
	khu_vuc_id?: number | string
	ngay_lap?: Dayjs
}

interface Props {
	options: TonghopOptions
	onSearch: (values: TonghopSearchValues) => void
	onReset: () => void
}

function SearchForm({ options, onSearch, onReset }: Props) {
	const [form] = Form.useForm<TonghopSearchValues>();
	const [expanded, setExpanded] = useState(false);

	const handleReset = () => {
		form.resetFields();
		onReset();
	};

	return (
		<Form<TonghopSearchValues>
			form={form}
			layout="horizontal"
			labelCol={{ span: 9 }}
			wrapperCol={{ span: 15 }}
			className="mb-4 grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
			onFinish={onSearch}
		>
			<Form.Item className="mb-0 w-full" label="Thiết bị" name="thiet_bi_id">
				<Select
					allowClear
					showSearch
					optionFilterProp="label"
					options={options.thietBi}
					placeholder="Chọn thiết bị"
					style={{ width: "100%" }}
				/>
			</Form.Item>
			<Form.Item className="mb-0 w-full" label="Đơn vị" name="don_vi_id">
				<Select
					allowClear
					showSearch
					optionFilterProp="label"
					options={options.donVi}
					placeholder="Chọn đơn vị"
					style={{ width: "100%" }}
				/>
			</Form.Item>
			<Form.Item className="mb-0 w-full" label="Vị trí lắp đặt" name="vi_tri_id">
				<Select
					allowClear
					showSearch
					optionFilterProp="label"
					options={options.viTriLapDat}
					placeholder="Chọn vị trí"
					style={{ width: "100%" }}
				/>
			</Form.Item>
			{expanded && (
				<>
					<Form.Item className="mb-0 w-full xl:col-start-1 xl:row-start-2" label="Khu vực" name="khu_vuc_id">
						<Select
							allowClear
							showSearch
							optionFilterProp="label"
							options={options.khuVuc}
							placeholder="Chọn khu vực"
							style={{ width: "100%" }}
						/>
					</Form.Item>
					<Form.Item className="mb-0 w-full xl:col-start-2 xl:row-start-2" label="Ngày lắp" name="ngay_lap">
						<DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày lắp" style={{ width: "100%" }} />
					</Form.Item>
				</>
			)}
			<div className="col-span-full flex flex-nowrap justify-end gap-2 xl:col-span-1 xl:col-start-4 xl:row-start-1">
				<Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
					Tìm
				</Button>
				<Button htmlType="button" icon={<ReloadOutlined />} onClick={handleReset}>
					Đặt lại
				</Button>
				<Button
					icon={expanded ? <UpOutlined /> : <DownOutlined />}
					htmlType="button"
					aria-expanded={expanded}
					onClick={() => setExpanded(value => !value)}
				>
					{expanded ? "Thu gọn" : "Mở rộng"}
				</Button>
			</div>
		</Form>
	);
}

export default SearchForm;
