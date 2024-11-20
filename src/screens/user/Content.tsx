import { Layout, Card, Button, Typography, Row, Col, Spin, Image } from 'antd';
import { AppstoreOutlined, ClockCircleOutlined, DollarOutlined, LaptopOutlined, PhoneOutlined, QuestionCircleOutlined, TabletOutlined } from '@ant-design/icons';
import Banner from './Banner';
import Slider from './Slider';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductHandleApi from '../../apis/ProductHandleApi';
import { Apple, Badge } from 'lucide-react';

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
        const model = product.productName.split(' ')[1];
        if (!acc[model]) {
            acc[model] = [];
        }
        acc[model].push(product);
        return acc;
    }, {} as Record<string, IProduct[]>);
};

function ContentPage() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await ProductHandleApi(`/api/product/getProductByCategoryID?categoryID=1`, {}, 'get');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    const handleCategoryClick = (categoryID: any) => {
        navigate(`/product/category/${categoryID}`);
    };

    return (
        <Content className="container mx-auto py-6">
            <Row gutter={[24, 24]}>
                <Col span={24} lg={18}>
                    <Banner />
                    <div className="w-full flex justify-center overflow-x-auto rounded-lg pl-3 mt-4 mb-4 scroll-smooth">
                        <div className="flex space-x-4 p-4 lg:hidden flex-nowrap">
                            <div className="flex flex-col items-center space-y-2 min-w-fit" onClick={() => handleCategoryClick(1)}>
                                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                                    <PhoneOutlined className="text-lg" />
                                </div>
                                <span className="text-xs text-center font-medium text-black">Điện thoại</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 min-w-fit" onClick={() => handleCategoryClick(2)}>
                                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                                    <TabletOutlined className="text-lg" />
                                </div>
                                <span className="text-xs text-center font-medium text-black">Tablet</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 min-w-fit" onClick={() => handleCategoryClick(3)}>
                                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                                    <LaptopOutlined className="text-lg" />
                                </div>
                                <span className="text-xs text-center font-medium text-black">Macbook</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 min-w-fit" onClick={() => handleCategoryClick(4)}>
                                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                                    <ClockCircleOutlined className="text-lg" />
                                </div>
                                <span className="text-xs text-center font-medium text-black">Apple Watch</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 min-w-fit" onClick={() => handleCategoryClick(5)}>
                                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                                    <AppstoreOutlined className="text-lg" />
                                </div>
                                <span className="text-xs text-center font-medium text-black">Phụ Kiện</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 min-w-fit" >
                                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                                    <DollarOutlined className="text-lg" />
                                </div>
                                <span className="text-xs text-center font-medium text-black">Mua Trả Góp</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 min-w-fit">
                                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                                    <AppstoreOutlined className="text-lg" />
                                </div>
                                <span className="text-xs text-center font-medium text-black">Công Nghệ</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2 min-w-fit">
                                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                                    <QuestionCircleOutlined className="text-lg" />
                                </div>
                                <span className="text-xs text-center font-medium text-black">Liên Hệ</span>
                            </div>
                        </div>
                    </div>



                    {loading ? (
                        <div className="flex justify-center items-center py-6">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            {Object.keys(groupedProducts).length === 0 ? (
                                <div className="text-center py-6 mt-8">
                                    <Title level={4}>Không có sản phẩm nào trong danh mục này</Title>
                                </div>
                            ) : (
                                Object.keys(groupedProducts).map((model) => (
                                    <div className="mb-8 mt-8" key={model}>
                                        <div className="relative mb-2">
                                            <div className="flex flex-col">
                                                <div className="relative w-fit">
                                                    <div className="bg-[#006838] flex items-center h-8">
                                                        <div className="flex items-center pl-2.5 pr-4">
                                                            <Apple className="w-3.5 h-3.5 text-white" />
                                                            <span className="text-white text-[13px] font-medium uppercase tracking-wider ml-2.5">
                                                                IPhone {model}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="absolute top-0 right-[-7px] h-full w-[8px] bg-[#006838]"
                                                            style={{
                                                                clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="h-[2px] bg-[#006838] flex-grow mb-[0px]" />
                                            </div>
                                        </div>

                                        <div
                                            className="grid gap-1"
                                            style={{
                                                gridTemplateColumns: 'repeat(6, minmax(180px, 1fr))',
                                                maxWidth: '100%',
                                            }}
                                        >
                                            {groupedProducts[model].slice(0, window.innerWidth <= 768 ? 2 : 6).map((product) => (
                                                <div
                                                    className="border border-transparent hover:border-[#006838] rounded-sm p-3 transition-colors"
                                                    key={product.productID}
                                                    onClick={() => handleProductClick(product.productID)}
                                                >
                                                    <div className="relative mb-2">
                                                        <img
                                                            src={product.image}
                                                            alt={product.productName}
                                                            className="w-full h-[200px] object-contain rounded-md"
                                                        />
                                                    </div>
                                                    <h3 className="text-sm font-medium mb-2 group-hover:text-[#006838] truncate">
                                                        {product.productName}
                                                    </h3>
                                                    <p className="text-red-500 font-bold mb-2">{formatPrice(product.price)}</p>
                                                    <div className="text-xs text-gray-500 space-y-0.5">
                                                        <span>Đặt mua - Giao hàng miễn phí</span>
                                                        <br />
                                                        <span>Trả Góp dễ dàng - LS Ưu Đãi</span>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </Col>


                <Slider size={6} />

            </Row>
        </Content>

    );
}

export default ContentPage;
