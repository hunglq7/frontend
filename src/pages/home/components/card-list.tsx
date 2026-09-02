import type { ColProps } from "antd";
import { useCameraStore } from "#src/store/camera/cameraStore";
import { useDonViStore } from "#src/store/donvi/donviStore";
import {
	BankOutlined,
	CameraOutlined,
	MoneyCollectOutlined,
	ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import { useEffect, useMemo } from "react";
import CountUp from "react-countup";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

const wrapperCol: ColProps = {
	xs: 24,
	sm: 24,
	md: 12,
	lg: 12,
	xl: 12,
	xxl: 6,
};

export default function CardList() {
	const { t } = useTranslation();
	const location = useLocation();

	// Tối ưu selector: chỉ lắng nghe độ dài mảng (nếu store hỗ trợ) hoặc dùng useMemo
	const listDonvi = useDonViStore(state => state.listDonvi);
	const fetchDonViList = useDonViStore(state => state.fetchDonViList);

	const totalCameras = useCameraStore(state => state.totalCameras);
	const fetchTotalCameras = useCameraStore(state => state.fetchTotalCameras);

	// Fetch lại khi người dùng quay lại trang Home hoặc route home thay đổi
	useEffect(() => {
		if (location.pathname === import.meta.env.VITE_BASE_HOME_PATH || location.pathname === "/") {
			Promise.all([fetchDonViList(), fetchTotalCameras()]);
		}
	}, [fetchDonViList, fetchTotalCameras, location.pathname]);

	// 2. Dùng useMemo để chỉ tạo lại mảng khi dữ liệu thực sự thay đổi
	const cardList = useMemo(() => {
		return [
			{
				id: "donvi",
				title: t("home.donvi"),
				data: listDonvi?.length || 0,
				icon: <BankOutlined />,
			},
			{
				id: "camera",
				title: t("home.camera"),
				data: totalCameras,
				icon: <CameraOutlined />,
			},
			{
				id: "purchases",
				title: t("home.purchases"),
				data: 9280,
				icon: <MoneyCollectOutlined />,
			},
			{
				id: "shoppings",
				title: t("home.shoppings"),
				data: 13600,
				icon: <ShoppingCartOutlined />,
			},
			{
				id: "shoppings_2",
				title: t("home.camera"),
				data: 13600,
				icon: <ShoppingCartOutlined />,
			},
		];
	}, [listDonvi?.length, totalCameras, t]);

	return (
		<Row justify="space-between" gutter={[20, 20]}>
			{cardList.map(cardItem => (
				// Dùng id duy nhất làm key thay vì title (để tránh lặp key)
				<Col key={cardItem.id} {...wrapperCol}>
					<Card className="bg-blend-color-burn transition duration-300 hover:-translate-y-2 hover:shadow-xl">
						<div className="flex justify-between items-center">
							<div className="flex flex-col">
								<h3 className="text-xl font-medium text-primary">
									{cardItem.title}
								</h3>
								<CountUp
									className="text-red-500 font-medium text-2xl"
									end={cardItem.data}
									separator=","
									duration={1.5}
								/>
							</div>
							<Button className="text-3xl" icon={cardItem.icon} type="text" />
						</div>
					</Card>
				</Col>
			))}
		</Row>
	);
}
