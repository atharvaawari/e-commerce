import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Select, Space } from "antd";

const { TextArea } = Input;

const ProductForm = ({ initialValues, onFinish, loading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            // Transform variations array to comma-separated string for display
            const formattedValues = {
                ...initialValues,
                colors: initialValues.variations?.colors?.join(", "),
                sizes: initialValues.variations?.sizes?.join(", "),
            };
            form.setFieldsValue(formattedValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleSubmit = (values) => {
        // Transform comma-separated strings back to arrays
        const formattedData = {
            ...values,
            variations: {
                colors: values.colors ? values.colors.split(",").map(c => c.trim()) : [],
                sizes: values.sizes ? values.sizes.split(",").map(s => s.trim()) : [],
            }
        };
        onFinish(formattedData);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="title"
                label="Product Title"
                rules={[{ required: true, message: "Please enter product title" }]}
            >
                <Input placeholder="Enter product title" />
            </Form.Item>

            <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Please enter price" }]}
                >
                    <InputNumber
                        prefix="₹"
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="0.00"
                    />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: "Please enter category" }]}
                >
                    <Input placeholder="Electronics, Clothing, etc." />
                </Form.Item>
            </Space>

            <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true, message: "Please enter image URL" }]}
            >
                <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter description" }]}
            >
                <TextArea rows={4} placeholder="Enter product details" />
            </Form.Item>

            <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                    name="colors"
                    label="Colors (comma separated)"
                    initialValue="Black, White"
                >
                    <Input placeholder="Black, White, Red" />
                </Form.Item>

                <Form.Item
                    name="sizes"
                    label="Sizes (comma separated)"
                    initialValue="S, M, L"
                >
                    <Input placeholder="S, M, L, XL" />
                </Form.Item>
            </Space>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    {initialValues ? "Update Product" : "Add Product"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProductForm;
