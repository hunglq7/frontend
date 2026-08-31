import type { ColProps } from "antd";
import { useDonViStore } from "#src/store/donvi/donviStore";
import {
	BankOutlined,
	MessageOutlined,
	MoneyCollectOutlined,
	ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import { useEffect } from "react";

import CountUp from "react-countup";
import { useTranslation } from "react-i18next";

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
	const { list, fetchDonViList } = useDonViStore();
	const CARD_LIST = [
		{
			title: t("home.donvi"),
			data: list.length,
			icon: <BankOutlined />,
		},
		{
			title: t("home.messages"),
			data: 81212,
			icon: <MessageOutlined />,
		},
		{
			title: t("home.purchases"),
			data: 9280,
			icon: <MoneyCollectOutlined />,
		},
		{
			title: t("home.shoppings"),
			data: 13600,
			icon: <ShoppingCartOutlined />,
		},
		{
			title: t("home.camera"),
			data: 13600,
			icon: <ShoppingCartOutlined />,
		},
	];
	useEffect(() => {
		fetchDonViList();
	}, [list]);

	return (
		<Row justify="space-between" gutter={[20, 20]}>
			{CARD_LIST.map((cardItem) => {
				return (
					<Col key={cardItem.title} {...wrapperCol}>
						<Card className="bg-blend-color-burn transition duration-300 hover:-translate-y-2 hover:shadow-xl ">
							<div className="flex justify-between items-center ">
								<div className="flex flex-col">
									<h3 className="text-xl font-medium text-primary">
										{cardItem.title}
									</h3>
									<CountUp
										className="text-red-500 font-medium"
										end={cardItem.data}
										separator=","
									/>
								</div>
								<Button className="text-3xl" icon={cardItem.icon} type="text" />
							</div>
						</Card>
					</Col>
				);
			})}
		</Row>
	);
}
