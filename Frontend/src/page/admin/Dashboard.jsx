import React, { useState } from "react";
import { Table, Button, Space, Typography, message, Popconfirm, Card, Tag, Modal } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsQueryFn, deleteProductMutationFn, syncProductsMutationFn, createProductMutationFn, updateProductMutationFn } from "../../lib/api";
import { DeleteOutlined, EditOutlined, SyncOutlined, PlusOutlined } from "@ant-design/icons";
import ProductForm from "../../components/admin/ProductForm";

const { Title } = Typography;

const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Fetch Products
    const { data: products, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProductsQueryFn,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createProductMutationFn,
        onSuccess: () => {
            message.success("Product created successfully");
            queryClient.invalidateQueries(["products"]);
            handleCancel();
        },
        onError: () => message.error("Failed to create product"),
    });

    const updateMutation = useMutation({
        mutationFn: updateProductMutationFn,
        onSuccess: () => {
            message.success("Product updated successfully");
            queryClient.invalidateQueries(["products"]);
            handleCancel();
        },
        onError: () => message.error("Failed to update product"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProductMutationFn,
        onSuccess: () => {
            message.success("Product deleted successfully");
            queryClient.invalidateQueries(["products"]);
        },
        onError: () => message.error("Failed to delete product"),
    });

    const syncMutation = useMutation({
        mutationFn: syncProductsMutationFn,
        onSuccess: (data) => {
            message.success(data.message || "Products synced successfully");
            queryClient.invalidateQueries(["products"]);
        },
        onError: () => message.error("Failed to sync products"),
    });

    // Handlers
    const handleDelete = (id) => deleteMutation.mutate(id);
    const handleSync = () => syncMutation.mutate();

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingProduct(record);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const onFormFinish = (values) => {
        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct._id, data: values });
        } else {
            createMutation.mutate(values);
        }
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (text) => <img src={text} alt="product" style={{ width: 50, height: 50, objectFit: "contain" }} />,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text) => <Typography.Text ellipsis style={{ maxWidth: 300 }}>{text}</Typography.Text>,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price}`,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Delete the product?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <Title level={2}>Admin Dashboard</Title>
                <Space>
                    <Button
                        type="primary"
                        icon={<SyncOutlined spin={syncMutation.isPending} />}
                        onClick={handleSync}
                        loading={syncMutation.isPending}
                        style={{ backgroundColor: '#1890ff' }}
                    >
                        Sync Products
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                        Add Product
                    </Button>
                </Space>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={products?.data || []}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingProduct ? "Edit Product" : "Add New Product"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <ProductForm
                    initialValues={editingProduct}
                    onFinish={onFormFinish}
                    loading={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </div>
    );
};

export default AdminDashboard;
