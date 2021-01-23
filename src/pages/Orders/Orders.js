import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import "./Orders.css";
import { Typography, Badge, Button } from "@material-ui/core";
import OrderBlock from "./OrderBlock";

// const OrderStatusBasket = 1
const OrderStatusInitiated = 2;
const OrderStatusInProcess = 3;
const OrderStatusInDelivery = 4;
const OrderStatusCancelled = 5;
const OrderStatusSuccessfull = 6;

const sectionEmptyString = (section) => {
    switch (section) {
        case OrderStatusInitiated:
            return "Жодне замовлення не очікує обробки";
        case OrderStatusInProcess:
            return "Жодне замовлення наразі не обробляється";
        case OrderStatusInDelivery:
            return "Жодне замовлення не здаходиться в доставці";
        case OrderStatusCancelled:
            return "Жодне замовлення не було скасоване";
        case OrderStatusSuccessfull:
            return "Жодне замовлення не було успішно виконане";
        default:
            break;
    }
};

const Orders = (props) => {
    const { isLoggedIn } = props;

    const [orders, setOrders] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [section, setSection] = useState(OrderStatusInitiated);

    useEffect(() => {
        if (isLoggedIn) {
            axios("/admin/orders/")
                .then((res) => {
                    console.log("AVAILABLE_ORDERS: ", res.data);
                    setOrders(res.data);
                })
                .catch((error) => {
                    console.log("AVAILABLE_ORDERS_ERROR: ", error);
                })
                .finally(setIsMounted(true));
        }
    }, [isLoggedIn]);

    const updateOrderStatus = (id, status) => {
        const ordersCopy = [...orders];
        ordersCopy[
            ordersCopy.findIndex((order) => order.info.id === id)
        ].info.order_status = status;

        console.log("Updated orders copy is :", ordersCopy);

        setOrders(ordersCopy);
    };

    return (
        <div className="orders">
            <div className="ActionBar Orders--filterbar">
                <Button
                    variant="text"
                    className={String(
                        section === OrderStatusInitiated && "active"
                    )}
                    onClick={() => setSection(OrderStatusInitiated)}
                >
                    <Badge
                        color="primary"
                        badgeContent={
                            orders.filter(
                                (order) =>
                                    order.info.order_status ===
                                    OrderStatusInitiated
                            ).length
                        }
                    >
                        Очікують обробки
                    </Badge>
                </Button>
                <Button
                    variant="text"
                    className={String(
                        section === OrderStatusInProcess && "active"
                    )}
                    onClick={() => setSection(OrderStatusInProcess)}
                >
                    <Badge
                        color="primary"
                        badgeContent={
                            orders.filter(
                                (order) =>
                                    order.info.order_status ===
                                    OrderStatusInProcess
                            ).length
                        }
                    >
                        Обробляються
                    </Badge>
                </Button>
                <Button
                    variant="text"
                    className={String(
                        section === OrderStatusInDelivery && "active"
                    )}
                    onClick={() => setSection(OrderStatusInDelivery)}
                >
                    <Badge
                        color="primary"
                        badgeContent={
                            orders.filter(
                                (order) =>
                                    order.info.order_status ===
                                    OrderStatusInDelivery
                            ).length
                        }
                    >
                        Доставляються
                    </Badge>
                </Button>
                <Button
                    variant="text"
                    className={String(
                        section === OrderStatusSuccessfull && "active"
                    )}
                    onClick={() => setSection(OrderStatusSuccessfull)}
                >
                    <Badge
                        color="primary"
                        badgeContent={
                            orders.filter(
                                (order) =>
                                    order.info.order_status ===
                                    OrderStatusSuccessfull
                            ).length
                        }
                    >
                        Успішно завершені
                    </Badge>
                </Button>
                <Button
                    variant="text"
                    className={String(
                        section === OrderStatusCancelled && "active"
                    )}
                    onClick={() => setSection(OrderStatusCancelled)}
                >
                    <Badge
                        color="primary"
                        badgeContent={
                            orders.filter(
                                (order) =>
                                    order.info.order_status ===
                                    OrderStatusCancelled
                            ).length
                        }
                    >
                        Скасовані замовлення
                    </Badge>
                </Button>
            </div>
            <div className="Orders">
                {isMounted &&
                    (orders.filter(
                        (order) => order.info.order_status === section
                    ).length === 0 ? (
                        <Typography variant="h5" className="NoData">
                            {sectionEmptyString(section)}
                        </Typography>
                    ) : (
                        <>
                            {orders
                                .filter(
                                    (order) =>
                                        order.info.order_status === section
                                )
                                .map((order, index) => {
                                    return (
                                        <OrderBlock
                                            {...order}
                                            index={index}
                                            onStatusUpdate={updateOrderStatus}
                                            key={order.info.id}
                                        />
                                    );
                                })}
                        </>
                    ))}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authReducer.isLoggedIn,
    };
};

export default connect(mapStateToProps)(Orders);
