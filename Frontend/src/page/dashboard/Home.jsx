import { Layout, Card, Typography, Button, Tag, Spin } from "antd";
import { ShoppingCartOutlined, StarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getProductsQueryFn } from "../../lib/api";
import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsQueryFn,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Content className="p-6 min-h-screen">
      <div className="mb-6 text-center">
        <Title level={2}>Featured Products</Title>
        <Text type="secondary">Explore our latest collection of premium items</Text>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        {products?.data?.map((product) => (
          <div key={product._id} className="w-[300px] flex-none">
            <Card
              hoverable
              onClick={() => navigate(`/product/${product._id}`)}
              cover={
                <img
                  alt={product.title}
                  src={product.image}
                  className="h-[200px] object-contain p-2 w-full"
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
                  }}
                >
                  Add to Cart
                </Button>,
                <Button
                  type="text"
                  danger={isInWishlist(product._id)}
                  icon={isInWishlist(product._id) ? <HeartFilled /> : <HeartOutlined />}
                  key="wishlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isInWishlist(product._id)) {
                      removeFromWishlist(product._id);
                    } else {
                      addToWishlist(product);
                    }
                  }}
                >
                </Button>,
                <Button
                  type="primary"
                  key="buy"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                    navigate("/cart");
                  }}
                >
                  Buy Now
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
                  <div>
                    <div className="mb-2">
                      <Tag color="blue">{product.category}</Tag>
                    </div>
                    <Text type="secondary" ellipsis={{ tooltip: product.description }}>
                      {product.description}
                    </Text>
                  </div>
                }
              />
            </Card>
          </div>
        ))}
      </div>
    </Content>
  );
};

export default Home;
