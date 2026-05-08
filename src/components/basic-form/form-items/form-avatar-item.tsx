import { UploadOutlined } from "@ant-design/icons";

import { Avatar, Button, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useAuthStore } from "#src/store/auth";

interface FormAvatarItemProps {
	value?: string
	onChange?: (value: any) => void
}

export function FormAvatarItem({ value, onChange }: FormAvatarItemProps) {
	const { token } = useAuthStore();

	return (
		<>
			<div className="flex items-center gap-5">
				<Avatar size={100} src={value} />
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
						action={`${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/upload`}
						headers={{
							authorization: `Bearer ${token}`,
						}}
						onChange={(info) => {
							// if (info.file.status !== 'uploading') {
							// 	console.log(info.file, info.fileList);
							// }
							if (info.file.status === "done") {
								window.$message?.success(`${info.file.name} file uploaded successfully`);
								onChange?.(info.file.response?.result);
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
