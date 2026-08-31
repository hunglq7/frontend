import type { UserItemType, UserListResponse, UserSavePayload, UserUpdatePayload } from "#src/api/user/types";
import { fetchCreateUser, fetchDeleteUser, fetchDeleteUsers, fetchUpdateUser, fetchUploadAvatar, fetchUserList } from "#src/api/user";
import { BasicContent } from "#src/components/basic-content";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag, Typography, Upload } from "antd";
import { useMemo, useState } from "react";

const roleOptions = [
	{ label: "admin", value: "admin" },
	{ label: "user", value: "user" },
];

export default function TaiKhoan() {
	const [form] = Form.useForm<UserSavePayload & { password?: string }>();
	const queryClient = useQueryClient();
	const [visible, setVisible] = useState(false);
	const [editingUser, setEditingUser] = useState<UserItemType | null>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [avatarUrl, setAvatarUrl] = useState<string>("");

	const {
		data,
		isLoading,
	} = useQuery<UserListResponse>({
		queryKey: ["user-list"],
		queryFn: () => fetchUserList(),
		staleTime: 1000 * 60,
	});

	const createMutation = useMutation({
		mutationFn: (payload: UserSavePayload) => fetchCreateUser(payload),
		onSuccess: async () => {
			message.success("Đã tạo tài khoản mới");
			setVisible(false);
			form.resetFields();
			await queryClient.invalidateQueries({ queryKey: ["user-list"] });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, payload }: { id: number, payload: UserUpdatePayload }) => fetchUpdateUser(id, payload),
		onSuccess: async () => {
			message.success("Cập nhật tài khoản thành công");
			setVisible(false);
			setEditingUser(null);
			form.resetFields();
			await queryClient.invalidateQueries({ queryKey: ["user-list"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => fetchDeleteUser(id),
		onSuccess: async () => {
			message.success("Xóa tài khoản thành công");
			await queryClient.invalidateQueries({ queryKey: ["user-list"] });
		},
	});

	const batchDeleteMutation = useMutation({
		mutationFn: (ids: number[]) => fetchDeleteUsers(ids),
		onSuccess: async () => {
			message.success("Xóa nhiều tài khoản thành công");
			setSelectedRowKeys([]);
			await queryClient.invalidateQueries({ queryKey: ["user-list"] });
		},
	});

	const avatarUploadMutation = useMutation({
		mutationFn: (file: File) => fetchUploadAvatar(file),
		onSuccess: async (data) => {
			setAvatarUrl(data.filename);
			form.setFieldValue("avatar", data.filename);
			message.success("Tải ảnh lên thành công");

			// If editing user, update the user immediately with new avatar
			if (editingUser) {
				try {
					const currentValues = form.getFieldsValue();
					await updateMutation.mutateAsync({
						id: editingUser.id,
						payload: {
							username: currentValues.username || "",
							email: currentValues.email || "",
							phone: currentValues.phone || "",
							avatar: data.filename,
							password: "",
							roles: currentValues.roles || [],
						},
					});
				}
				catch (error) {
					console.error(error);
					message.error("Cập nhật avatar thất bại");
				}
			}
		},
		onError: () => {
			message.error("Tải ảnh lên thất bại");
		},
	});

	const users = data?.list ?? [];

	const columns = useMemo(
		() => [
			{
				title: "ID",
				dataIndex: "id",
				sorter: (a: UserItemType, b: UserItemType) => a.id - b.id,
			},
			{
				title: "Tên đăng nhập",
				dataIndex: "username",
			},
			{
				title: "Email",
				dataIndex: "email",
			},
			{
				title: "Số điện thoại",
				dataIndex: "phone",
			},
			{
				title: "Avatar",
				dataIndex: "avatar",
				width: 80,
				render: (avatar: string) => (
					<Avatar
						src={avatar ? `${import.meta.env.VITE_API_BASE_URL}${avatar}` : undefined}
						size={40}
					/>
				),
			},
			{
				title: "Roles",
				dataIndex: "roles",
				render: (roles: string[]) => (
					<Space size={8} wrap>
						{roles.map(role => (
							<Tag key={role} color={role === "admin" ? "volcano" : "blue"}>
								{role}
							</Tag>
						))}
					</Space>
				),
			},
			{
				title: "Ngày tạo",
				dataIndex: "created_at",
				render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
			},

			{
				title: "Hành động",
				key: "actions",
				width: 180,
				render: (_: any, record: UserItemType) => (
					<Space>
						<Button
							size="small"
							icon={<EditOutlined />}
							onClick={() => {
								setEditingUser(record);
								setAvatarUrl(record.avatar || "");
								form.setFieldsValue({
									username: record.username,
									email: record.email,
									phone: record.phone,
									avatar: record.avatar,
									roles: record.roles,
								});
								setVisible(true);
							}}
						>
							Sửa
						</Button>
						<Popconfirm
							title="Bạn có chắc muốn xóa?"
							onConfirm={() => deleteMutation.mutate(record.id)}
							okText="Xóa"
							cancelText="Hủy"
						>
							<Button size="small" danger icon={<DeleteOutlined />}>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[deleteMutation, form],
	);

	const openCreateModal = () => {
		setEditingUser(null);
		setAvatarUrl("");
		form.resetFields();
		form.setFieldsValue({ roles: ["user"] });
		setVisible(true);
	};

	const closeModal = () => {
		setVisible(false);
		setEditingUser(null);
		setAvatarUrl("");
		form.resetFields();
	};

	const handleSubmit = async (values: UserSavePayload & { password?: string }) => {
		if (editingUser) {
			const payload: UserUpdatePayload = {
				username: values.username || "",
				email: values.email || "",
				phone: values.phone || "",
				avatar: values.avatar || "",
				password: values.password || "",
				roles: values.roles || [],
			};
			await updateMutation.mutateAsync({ id: editingUser.id, payload });
		}
		else {
			await createMutation.mutateAsync({
				username: values.username,
				email: values.email,
				phone: values.phone,
				avatar: values.avatar,
				password: values.password || "",
				roles: values.roles,
			});
		}
	};

	return (
		<BasicContent>
			<div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Typography.Title level={4} className="!mt-0">
						Quản lý tài khoản
					</Typography.Title>
					<Typography.Text type="secondary">
						Chỉ admin mới có thể truy cập danh mục này.
					</Typography.Text>
				</div>
				<Space>
					<Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
						Thêm tài khoản
					</Button>
					<Popconfirm
						title="Xóa tất cả tài khoản đã chọn?"
						onConfirm={() => batchDeleteMutation.mutate(selectedRowKeys as number[])}
						okText="Xóa"
						cancelText="Hủy"
					>
						<Button danger disabled={selectedRowKeys.length === 0}>
							Xóa nhiều
						</Button>
					</Popconfirm>
				</Space>
			</div>
			<Table<UserItemType>
				rowKey="id"
				loading={
					isLoading
					|| createMutation.isPending
					|| updateMutation.isPending
					|| deleteMutation.isPending
					|| batchDeleteMutation.isPending
				}
				columns={columns}
				dataSource={users}
				rowSelection={{
					selectedRowKeys,
					onChange: keys => setSelectedRowKeys(keys),
				}}
				pagination={false}
				scroll={{ x: 800 }}
			/>

			<Modal
				title={editingUser ? "Chỉnh sửa tài khoản" : "Thêm tài khoản"}
				open={visible}
				onCancel={closeModal}
				footer={null}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					initialValues={{ roles: ["user"] }}
				>
					<Form.Item
						name="username"
						label="Tên đăng nhập"
						rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
					>
						<Input placeholder="Nhập tên đăng nhập" />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}
					>
						<Input placeholder="Nhập email" />
					</Form.Item>
					<Form.Item
						name="phone"
						label="Số điện thoại"
					>
						<Input placeholder="Nhập số điện thoại" />
					</Form.Item>
					<Form.Item label="Ảnh đại diện">
						<div className="flex flex-col gap-3">
							{avatarUrl && (
								<Avatar
									src={avatarUrl.startsWith("http") ? avatarUrl : `${import.meta.env.VITE_API_BASE_URL}${avatarUrl}`}
									size={80}
								/>
							)}
							<Upload
								beforeUpload={(file) => {
									if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
										message.error("Chỉ hỗ trợ hình ảnh JPG/PNG/GIF");
										return false;
									}
									if (file.size > 5 * 1024 * 1024) {
										message.error("Kích thước ảnh không được vượt quá 5MB");
										return false;
									}
									avatarUploadMutation.mutate(file);
									return false;
								}}
								accept=".jpg,.jpeg,.png,.gif"
								maxCount={1}
								showUploadList={false}
								disabled={avatarUploadMutation.isPending}
							>
								<Button loading={avatarUploadMutation.isPending}>
									{avatarUploadMutation.isPending ? "Đang tải..." : "Chọn ảnh"}
								</Button>
							</Upload>
						</div>
					</Form.Item>
					<Form.Item
						name="avatar"
						hidden
					>
						<Input type="hidden" />
					</Form.Item>
					<Form.Item
						name="password"
						label="Mật khẩu"
						rules={editingUser ? [] : [{ required: true, message: "Vui lòng nhập mật khẩu" }]}
					>
						<Input.Password placeholder={editingUser ? "Để trống nếu không đổi" : "Nhập mật khẩu"} />
					</Form.Item>
					<Form.Item
						name="roles"
						label="Vai trò"
						rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
					>
						<Select mode="multiple" options={roleOptions} placeholder="Chọn vai trò" />
					</Form.Item>
					<Form.Item>
						<Space>
							<Button onClick={closeModal}>Hủy</Button>
							<Button type="primary" htmlType="submit">
								{editingUser ? "Lưu" : "Tạo"}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</BasicContent>
	);
}
