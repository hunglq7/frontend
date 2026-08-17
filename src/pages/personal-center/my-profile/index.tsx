import { fetchUpdateUser } from "#src/api/user";
import { BasicContent } from "#src/components/basic-content";
import { FormAvatarItem } from "#src/components/basic-form";
import { useUserStore } from "#src/store/user";

import {
	ProForm,
	ProFormDigit,
	ProFormText,
	ProFormTextArea,
} from "@ant-design/pro-components";
import { Form, Input } from "antd";
import { useEffect, useMemo, useRef } from "react";

const URL_TRAILING_SLASH_REGEX = /\/$/;
const LEADING_SLASH_REGEX = /^\/+/;
export default function Profile() {
	const { avatar, username, email, phoneNumber, description, id, getUserInfo, setUserInfo } = useUserStore();
	const [form] = Form.useForm();
	const formRef = useRef<any>(null);

	const getAvatarSrc = (avatarPath?: string) => {
		if (!avatarPath)
			return "https://avatar.vercel.sh/blur.svg?text=2";
		if (avatarPath.startsWith("http"))
			return avatarPath;
		const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(URL_TRAILING_SLASH_REGEX, "");
		const normalizedPath = avatarPath.replace(LEADING_SLASH_REGEX, "");
		return `${baseUrl}/${normalizedPath}`;
	};

	const formInitialValues = useMemo(() => ({
		avatar: getAvatarSrc(avatar),
		username: username || "",
		email: email || "",
		phoneNumber: phoneNumber || "",
		description: description || "",
	}), [avatar, username, email, phoneNumber, description]);

	const avatarFieldValue = form.getFieldValue("avatar") ?? formInitialValues.avatar;

	useEffect(() => {
		if (id) {
			getUserInfo().then((res: any) => {
				const userData = res || useUserStore.getState();
				form.setFieldsValue({
					avatar: getAvatarSrc(userData.avatar),
					username: userData.username || "",
					email: userData.email || "",
					phoneNumber: userData.phoneNumber || "",
					description: userData.description || "",
				});
			});
		}
	}, [id, form, getUserInfo]);

	const handleFinish = async (values: any) => {
		try {
			if (!id) {
				window.$message?.error("User ID không hợp lệ!");
				return;
			}

			let avatarPath = values.avatar;
			if (avatarPath && avatarPath.startsWith("http")) {
				const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(URL_TRAILING_SLASH_REGEX, "");
				if (avatarPath.startsWith(baseUrl)) {
					avatarPath = avatarPath.replace(baseUrl, "");
				}
			}

			const updatePayload = {
				username: values.username,
				email: values.email,
				phone: values.phoneNumber,
				avatar: avatarPath,
				description: values.description,
			};

			const result = await fetchUpdateUser(Number(id), updatePayload);
			setUserInfo(result);
			window.$message?.success("Cập nhật thông tin thành công!");
		}
		catch (error) {
			console.error("Update error:", error);
			window.$message?.error("Cập nhật thông tin thất bại!");
		}
	};

	return (
		<BasicContent className="max-w-md ml-10">
			<h3>Thông tin tài khoản</h3>
			<ProForm
				form={form}
				formRef={formRef}
				layout="vertical"
				onFinish={handleFinish}
				initialValues={formInitialValues}
				requiredMark
			>
				<Form.Item
					name="avatar"
					label="Ảnh đại diện"
					rules={[
						{
							required: true,
							message: "Ảnh đại diện không được để trống!",
						},
					]}
				>
					<FormAvatarItem
						value={avatarFieldValue}
						onChange={nextValue => form.setFieldValue("avatar", nextValue)}
					/>
				</Form.Item>
				<ProFormText
					name="username"
					label="Tài khoản"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên đăng nhập!",
						},
					]}
				/>
				<ProFormText
					name="email"
					label="Email"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập email!",
						},
					]}
				/>
				<ProFormDigit
					name="phoneNumber"
					label="Số điện thoại"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập số điện thoại!",
						},
					]}
				>
					<Input type="tel" allowClear />
				</ProFormDigit>
				<ProFormTextArea
					allowClear
					name="description"
					label="Mô tả cá nhân"
					placeholder="Mô tả về bản thân bạn"
				/>
			</ProForm>
		</BasicContent>
	);
};
