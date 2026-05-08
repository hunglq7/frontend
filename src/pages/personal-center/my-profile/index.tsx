import {
	ProForm,
	ProFormDigit,
	ProFormText,
	ProFormTextArea,
} from "@ant-design/pro-components";
import { Form, Input } from "antd";
import { useEffect } from "react";
import { fetchUpdateUser } from "#src/api/user";

import { BasicContent } from "#src/components/basic-content";
import { FormAvatarItem } from "#src/components/basic-form";
import { useUserStore } from "#src/store/user";

const URL_TRAILING_SLASH_REGEX = /\/$/;

export default function Profile() {
	const { avatar, username, email, phoneNumber, description, id, getUserInfo, setUserInfo } = useUserStore();

	useEffect(() => {
		// Lấy thông tin user mới nhất từ server khi component mount
		if (id) {
			getUserInfo();
		}
	}, [id, getUserInfo]);

	const handleFinish = async (values: any) => {
		try {
			if (!id) {
				window.$message?.error("User ID không hợp lệ!");
				return;
			}

			const updatePayload = {
				username: values.username,
				email: values.email,
				phone: values.phoneNumber,
				avatar: values.avatar,
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

	const getAvatarSrc = (avatar: string) => {
		if (!avatar)
			return "https://avatar.vercel.sh/blur.svg?text=2";
		return avatar.startsWith("http") ? avatar : `${import.meta.env.VITE_API_BASE_URL.replace(URL_TRAILING_SLASH_REGEX, "")}${avatar}`;
	};

	return (
		<BasicContent className="max-w-md ml-10">
			<h3>Thông tin tài khoản</h3>
			<ProForm
				layout="vertical"
				onFinish={handleFinish}
				initialValues={{
					avatar: getAvatarSrc(avatar),
					username,
					email,
					phoneNumber,
					description,
				}}
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
					<FormAvatarItem />
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
