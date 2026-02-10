import React from "react";
import { Layout, Typography, List, Avatar, Button, Space, InputNumber, Card, Divider, Empty } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useCart } from "../../context/CartContext.jsx";
import { useNavigate } from "react-router";

const { Content } = Layout;
const { Title, Text } = Typography;

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const total = getCartTotal();

    if (cart.length === 0) {
        return (
            <Content className="p-6 min-h-screen flex justify-center items-center">
                <Empty
                    description="Your cart is empty"
                >
                    <Button type="primary" onClick={() => navigate("/")}>Go Shopping</Button>
                </Empty>
            </Content>
        );
    }

    return (
        <Content className="p-6 min-h-screen max-w-[800px] mx-auto">
            <Title level={2}>Shopping Cart</Title>

            <List
                itemLayout="horizontal"
                dataSource={cart}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Space>
                                <Button
                                    icon={<MinusOutlined />}
                                    size="small"
                                    onClick={() => updateQuantity(item._id, item.color, item.size, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                />
                                <Text>{item.quantity}</Text>
                                <Button
                                    icon={<PlusOutlined />}
                                    size="small"
                                    onClick={() => updateQuantity(item._id, item.color, item.size, item.quantity + 1)}
                                />
                            </Space>,
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeFromCart(item._id, item.color, item.size)}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.image} size={64} shape="square" />}
                            title={<Text strong>{item.title}</Text>}
                            description={
                                <Space direction="vertical" size={0}>
                                    <Text type="secondary">${item.price}</Text>
                                    <Text type="secondary" className="text-xs">
                                        {item.color && `Color: ${item.color}`} {item.size && ` | Size: ${item.size}`}
                                    </Text>
                                </Space>
                            }
                        />
                        <div>
                            <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
                        </div>
                    </List.Item>
                )}
            />

            <Divider />

            <div className="flex justify-between items-center">
                <Space>
                    <Button danger onClick={clearCart}>Clear Cart</Button>
                </Space>

                <div className="text-right">
                    <Title level={4}>Total: ${total.toFixed(2)}</Title>
                    <Button type="primary" size="large" onClick={() => navigate("/checkout")}>
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </Content>
    );
};

export default Cart;
