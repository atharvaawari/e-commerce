import React, { useState } from "react";
import { Layout, Typography, Form, Input, Button, Radio, Card, Row, Col, Divider, message, Steps } from "antd";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router";

const { Content } = Layout;
const { Title, Text } = Typography;

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();

    const total = getCartTotal();

    if (cart.length === 0 && currentStep === 0) {
        return (
            <Content className="p-6 min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <Title level={3}>Your cart is empty</Title>
                    <Button type="primary" onClick={() => navigate("/")}>Go Shopping</Button>
                </div>
            </Content>
        );
    }

    const onFinish = (values) => {
        console.log("Order details:", values);
        setCurrentStep(1);
        setTimeout(() => {
            message.success("Order placed successfully!");
            clearCart();
            navigate("/");
        }, 1500);
    };

    return (
        <Content className="p-6 min-h-screen max-w-[1000px] mx-auto">
            <Title level={2} className="mb-8">Checkout</Title>

            <Row gutter={48}>
                <Col xs={24} md={14}>
                    <Card title="Shipping Information" bordered={false}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                                <Input placeholder="John Doe" />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input placeholder="john@example.com" />
                            </Form.Item>
                            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                                <Input.TextArea rows={3} placeholder="123 Main St, City, Country" />
                            </Form.Item>
                            <Form.Item name="payment" label="Payment Method" initialValue="cod">
                                <Radio.Group>
                                    <Radio value="cod">Cash on Delivery</Radio>
                                    <Radio value="card" disabled>Credit Card (Coming Soon)</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large" block>
                                    Place Order (₹{total.toFixed(2)})
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={10}>
                    <Card title="Order Summary" bordered={false} className="bg-gray-50">
                        {cart.map(item => (
                            <div key={`${item._id}-${item.color}-${item.size}`} className="flex justify-between mb-4">
                                <div>
                                    <Text strong>{item.title}</Text>
                                    <div className="text-xs text-gray-500">
                                        Qty: {item.quantity} {item.color ? `| ${item.color}` : ''}
                                    </div>
                                </div>
                                <Text>₹{(item.price * item.quantity).toFixed(2)}</Text>
                            </div>
                        ))}
                        <Divider />
                        <div className="flex justify-between">
                            <Title level={4}>Total</Title>
                            <Title level={4}>₹{total.toFixed(2)}</Title>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default Checkout;
