import React from "react";
import { Layout, Typography, Form, Input, Button, Card, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { sendEnquiryMutationFn } from "../../lib/api";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();

    const { mutate, isPending } = useMutation({
        mutationFn: sendEnquiryMutationFn,
        onSuccess: () => {
            message.success("Enquiry sent successfully!");
            form.resetFields();
        },
        onError: (error) => {
            message.error("Failed to send enquiry. Please try again.");
        }
    });

    const onFinish = (values) => {
        mutate(values);
    };

    return (
        <Content className="p-6 min-h-screen flex justify-center items-center bg-gray-50">
            <Card title={<Title level={3} className="text-center m-0">Contact Us</Title>} className="w-full max-w-[500px] p-5 shadow-sm">
                <Paragraph className="text-center mb-6">
                    Have questions? Fill out the form below and we'll get back to you shortly.
                </Paragraph>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input placeholder="Your Name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input placeholder="your.email@example.com" />
                    </Form.Item>

                    <Form.Item
                        label="Subject"
                        name="subject"
                        rules={[{ required: true, message: 'Please input the subject!' }]}
                    >
                        <Input placeholder="Subject" />
                    </Form.Item>

                    <Form.Item
                        label="Message"
                        name="message"
                        rules={[{ required: true, message: 'Please input your message!' }]}
                    >
                        <TextArea rows={4} placeholder="How can we help you?" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} block size="large">
                            Send Enquiry
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Content>
    );
};

export default Contact;
