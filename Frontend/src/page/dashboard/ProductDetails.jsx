import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductByIdQueryFn } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Layout, Row, Col, Typography, Button, Tag, Spin, Space, Radio, message, Image } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    const { data: productData, isLoading, isError } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductByIdQueryFn(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !productData?.data) {
        return <div>Product not found</div>;
    }

    const product = productData.data;

    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

    const handleAddToCart = () => {
        addToCart(product, 1, selectedColor, selectedSize);
    };

    return (
        <Content className="p-6 min-h-screen max-w-[1200px] mx-auto">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="mb-4">
                Back
            </Button>

            <Row gutter={[48, 24]}>
                {/* Image Section */}
                <Col xs={24} md={12}>
                    <div className="border border-gray-100 p-6 flex justify-center rounded-lg">
                        <Image
                            src={product.image}
                            alt={product.title}
                            className="max-h-[500px] object-contain max-w-full"
                        />
                    </div>
                </Col>

                {/* Details Section */}
                <Col xs={24} md={12}>
                    <Typography>
                        <Tag color="blue" className="mb-2">{product.category}</Tag>
                        <Title level={2}>{product.title}</Title>
                        <Title level={3} type="success">₹{product.price}</Title>

                        <Paragraph className="text-base text-gray-600">
                            {product.description}
                        </Paragraph>

                        <div className="mt-6">
                            <Title level={5}>Colors</Title>
                            <Radio.Group onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
                                {product.variations?.colors?.map(color => (
                                    <Radio.Button key={color} value={color}>{color}</Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                        <div className="mt-6">
                            <Title level={5}>Sizes</Title>
                            <Radio.Group onChange={(e) => setSelectedSize(e.target.value)} value={selectedSize}>
                                {product.variations?.sizes?.map(size => (
                                    <Radio.Button key={size} value={size}>{size}</Radio.Button>
                                ))}
                            </Radio.Group>
                        </div>

                        <div className="mt-8 flex items-center">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                                className="w-[200px]"
                            >
                                Add to Cart
                            </Button>
                            <Button
                                size="large"
                                icon={isInWishlist(product._id) ? <HeartFilled /> : <HeartOutlined />}
                                onClick={() => {
                                    if (isInWishlist(product._id)) {
                                        removeFromWishlist(product._id);
                                    } else {
                                        addToWishlist(product);
                                    }
                                }}
                                className="ml-3"
                                danger={isInWishlist(product._id)}
                            >
                                {isInWishlist(product._id) ? "In Wishlist" : "Wishlist"}
                            </Button>
                        </div>
                    </Typography>
                </Col>
            </Row>
        </Content>
    );
};

export default ProductDetails;
