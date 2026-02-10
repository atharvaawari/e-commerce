import { Layout, Typography, Card, Button, Tag, Empty } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    if (wishlist.length === 0) {
        return (
            <Content className="p-6 min-h-screen flex justify-center items-center">
                <Empty description="Your wishlist is empty">
                    <Button type="primary" onClick={() => navigate("/")}>Go Shopping</Button>
                </Empty>
            </Content>
        );
    }

    return (
        <Content className="p-6 min-h-screen">
            <div className="mb-6 text-center">
                <Title level={2}>My Wishlist</Title>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
                {wishlist.map((product) => (
                    <div key={product._id} className="w-[300px] flex-none">
                        <Card
                            hoverable
                            onClick={() => navigate(`/product/${product._id}`)}
                            cover={
                                <img
                                    alt={product.title}
                                    src={product.image}
                                    className="h-[200px] object-contain p-2"
                                />
                            }
                            actions={[
                                <Button
                                    type="text"
                                    icon={<ShoppingCartOutlined />}
                                    key="cart"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(product);
                                        removeFromWishlist(product._id);
                                    }}
                                >
                                    Move to Cart
                                </Button>,
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    key="delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromWishlist(product._id);
                                    }}
                                >
                                    Remove
                                </Button>
                            ]}
                        >
                            <Meta
                                title={
                                    <div className="flex justify-between items-center">
                                        <span className="truncate max-w-[150px]" title={product.title}>{product.title}</span>
                                        <Tag color="green">${product.price}</Tag>
                                    </div>
                                }
                                description={
                                    <Text type="secondary" ellipsis={{ tooltip: product.description }}>
                                        {product.description}
                                    </Text>
                                }
                            />
                        </Card>
                    </div>
                ))}
            </div>
        </Content>
    );
};

export default Wishlist;
