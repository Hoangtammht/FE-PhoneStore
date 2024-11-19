import { Layout, Card, Button, Badge, Typography, Row, Col } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import Slider from './Slider';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderContent from './HeaderContent';
import { useState, useEffect } from 'react';
import ProductHandleApi from '../../apis/ProductHandleApi';

const { Content } = Layout;
const { Title, Text } = Typography;

interface IProduct {
    productID: number;
    categoryID: number;
    productName: string;
    image: string;
    description: string;
    price: number;
    stock: number;
    status: number;
}

const groupByModel = (products: IProduct[]) => {
    return products.reduce((acc, product) => {
        const words = product.productName.split(' ');

        let model = words.slice(0, 2).join(' ');

        if (!acc[model]) {
            acc[model] = [];
        }
        acc[model].push(product);
        return acc;
    }, {} as Record<string, IProduct[]>);
};



function ProductByCategory() {
    const { categoryID } = useParams<{ categoryID: string }>();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchProducts = async (categoryID: number) => {
        try {
            const response = await ProductHandleApi(`/api/product/getProductByCategoryID?categoryID=${categoryID}`, {}, 'get');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categoryID) {
            fetchProducts(parseInt(categoryID));
        }
    }, [categoryID]);

    const handleProductClick = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price).replace('₫', 'đ');
    };

    const groupedProducts = groupByModel(products);

    const filteredGroupedProducts = selectedModel
        ? Object.keys(groupedProducts).reduce((acc, model) => {
            if (model.toLowerCase().includes(selectedModel.toLowerCase())) {
                acc[model] = groupedProducts[model];
            }
            return acc;
        }, {} as Record<string, IProduct[]>)
        : groupedProducts;

    return (
        <Content className="container mx-auto py-6">
            <Row gutter={[24, 24]}>
                <Col span={18}>
                    <HeaderContent
                        models={Object.keys(groupedProducts).map(model => {
                            const firstProduct = groupedProducts[model][0];
                            return {
                                name: model,
                                image: firstProduct.image
                            };
                        })}
                        onModelSelect={(model) => setSelectedModel(model)}
                    />
                    {Object.keys(filteredGroupedProducts).map((model) => (
                        <div className="mb-8" key={model}>
                            <Title level={3} className="flex items-center gap-2 mb-6 border-b border-green-600 pb-2">
                                <PhoneOutlined className="text-green-600" />
                                {model.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </Title>

                            <Row gutter={[16, 16]}>
                                {filteredGroupedProducts[model].map((product) => (
                                    <Col xs={24} sm={12} md={8} lg={8} xl={8} key={product.productID} onClick={() => handleProductClick(product.productID)}>
                                        <Card
                                            hoverable
                                            className="h-full"
                                            cover={
                                                <div className="relative p-4">
                                                    <img
                                                        src={product.image}
                                                        alt={product.productName}
                                                        className="w-full h-48 object-contain"
                                                    />
                                                </div>
                                            }
                                        >
                                            <Card.Meta
                                                title={<Text className="text-sm font-medium">{product.productName}</Text>}
                                                description={
                                                    <div className="space-y-3">
                                                        <Text className="text-xl font-bold text-red-600 block">
                                                            {formatPrice(product.price)}
                                                        </Text>
                                                        <div className="space-y-2 pt-2">
                                                            <Button type="primary" block className="bg-blue-600">
                                                                Đặt mua - Giao hàng miễn phí
                                                            </Button>
                                                            <Button block>
                                                                Trả Góp 0% đăng - LS Ưu Đãi
                                                            </Button>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))}

                </Col>

                <Slider size={6} />
            </Row>
        </Content>
    );
}

export default ProductByCategory;
