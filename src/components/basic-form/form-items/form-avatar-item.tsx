import { useAuthStore } from "#src/store/auth";

import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Upload } from "antd";
import ImgCrop from "antd-img-crop";

interface FormAvatarItemProps {
	value?: string
	onChange?: (value: any) => void
}
const TRAILING_SLASH_REGEX = /\/$/;
const LEADING_SLASH_REGEX = /^\/+/;

export function FormAvatarItem({ value, onChange }: FormAvatarItemProps) {
	const { token } = useAuthStore();

	const avatarSrc = (() => {
		if (!value) {
			return "https://avatar.vercel.sh/blur.svg?text=2";
		}
		if (typeof value !== "string") {
			return "https://avatar.vercel.sh/blur.svg?text=2";
		}
		if (value.startsWith("http")) {
			return value;
		}
		const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(TRAILING_SLASH_REGEX, "");
		const normalizedPath = value.replace(LEADING_SLASH_REGEX, "");
		return `${baseUrl}/${normalizedPath}`;
	})();

	const normalizeUploadedValue = (response: any) => {
		if (!response) {
			return "";
		}
		if (typeof response === "string") {
			return response;
		}
		return response.filename || response.result || response.url || response.data?.filename || response.data?.result || "";
	};

	return (
		<>
			<div className="flex items-center gap-5">
				<Avatar size={100} src={avatarSrc} />
				<ImgCrop
					rotationSlider
					aspectSlider
					showReset
					showGrid
					cropShape="rect"
				>
					<Upload
						accept="image/*"
						showUploadList={false}
						name="file"
						action={`${import.meta.env.VITE_API_BASE_URL.replace(TRAILING_SLASH_REGEX, "")}/upload`}
						headers={{
							authorization: `Bearer ${token}`,
						}}
						onChange={(info) => {
							if (info.file.status === "done") {
								const uploadedValue = normalizeUploadedValue(info.file.response);
								if (uploadedValue) {
									onChange?.(uploadedValue);
									window.$message?.success(`${info.file.name} file uploaded successfully`);
								}
								else {
									window.$message?.error(`${info.file.name} file upload failed.`);
								}
							}
							else if (info.file.status === "error") {
								window.$message?.error(`${info.file.name} file upload failed.`);
							}
						}}
					>
						<Button icon={<UploadOutlined />}>
							Upload
						</Button>
					</Upload>
				</ImgCrop>
			</div>
		</>
	);
}
