import { fetchUpdateUser, fetchUploadAvatar } from "#src/api/user";
import { useUserStore } from "#src/store/user";
import { CameraOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Button, message, Modal, Upload } from "antd";
import { useState } from "react";

interface UploadAvatarModalProps {
	open: boolean
	onClose: () => void
}

export function UploadAvatarModal({ open, onClose }: UploadAvatarModalProps) {
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const avatar = useUserStore(state => state.avatar);
	const userId = useUserStore(state => state.id);
	const setAvatar = useUserStore(state => state.setAvatar);
	const username = useUserStore(state => state.username);
	const email = useUserStore(state => state.email);
	const phoneNumber = useUserStore(state => state.phoneNumber);
	const roles = useUserStore(state => state.roles);

	const uploadMutation = useMutation({
		mutationFn: async (file: File) => {
			if (!userId) {
				throw new Error("User ID not found");
			}
			const uploadResult = await fetchUploadAvatar(file);
			// Update user with new avatar
			const updateResult = await fetchUpdateUser(Number.parseInt(userId), {
				username,
				email,
				phone: phoneNumber,
				avatar: uploadResult.filename,
				password: "",
				roles,
			});
			return updateResult;
		},
		onSuccess: (data) => {
			if (data.avatar) {
				setAvatar(data.avatar);
			}
			message.success("Avatar updated successfully");
			onClose();
			setSelectedFile(null);
			setPreviewUrl("");
		},
		onError: (error) => {
			message.error("Failed to update avatar");
			console.error(error);
		},
	});

	const handleUpload = (file: File) => {
		if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
			message.error("Only JPG/PNG/GIF images are supported");
			return false;
		}
		if (file.size > 5 * 1024 * 1024) {
			message.error("Image size must not exceed 5MB");
			return false;
		}

		setSelectedFile(file);

		// Create preview URL
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewUrl(reader.result as string);
		};
		reader.readAsDataURL(file);

		return false;
	};

	const handleConfirm = () => {
		if (selectedFile) {
			uploadMutation.mutate(selectedFile);
		}
	};

	const currentAvatarUrl = avatar
		? (avatar.startsWith("http") ? avatar : `${import.meta.env.VITE_API_BASE_URL}${avatar}`)
		: undefined;

	return (
		<Modal
			title="Upload Avatar"
			open={open}
			onCancel={onClose}
			footer={[
				<Button key="cancel" onClick={onClose}>
					Cancel
				</Button>,
				<Button
					key="submit"
					type="primary"
					loading={uploadMutation.isPending}
					disabled={!selectedFile}
					onClick={handleConfirm}
				>
					Upload
				</Button>,
			]}
		>
			<div className="flex flex-col gap-4">
				<div className="flex gap-8">
					<div className="flex flex-col items-center gap-2">
						<span className="text-sm text-gray-500">Current Avatar</span>
						<Avatar
							src={currentAvatarUrl}
							size={100}
						/>
					</div>
					{previewUrl && (
						<div className="flex flex-col items-center gap-2">
							<span className="text-sm text-gray-500">Preview</span>
							<Avatar
								src={previewUrl}
								size={100}
							/>
						</div>
					)}
				</div>
				<Upload
					beforeUpload={handleUpload}
					accept=".jpg,.jpeg,.png,.gif"
					maxCount={1}
					showUploadList={false}
					listType="picture"
				>
					<Button icon={<CameraOutlined />} block>
						Select Image
					</Button>
				</Upload>
			</div>
		</Modal>
	);
}
