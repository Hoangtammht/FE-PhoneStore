import { Layout, Card, Button, Typography, Row, Col, Spin } from 'antd';
import { 
    AppstoreOutlined, 
    ClockCircleOutlined, 
    DollarOutlined, 
    LaptopOutlined, 
    PhoneOutlined, 
    QuestionCircleOutlined, 
    TabletOutlined 
} from '@ant-design/icons';
import { Apple } from 'lucide-react';
import Banner from './Banner';
import Slider from './Slider';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductHandleApi from '../../apis/ProductHandleApi';

const { Content } = Layout;
const { Title } = Typography;

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

const categories = [
    { id: 1, icon: <PhoneOutlined />, label: "Điện thoại" },
    { id: 2, icon: <TabletOutlined />, label: "Tablet" },
    { id: 3, icon: <LaptopOutlined />, label: "Macbook" },
    { id: 4, icon: <ClockCircleOutlined />, label: "Apple Watch" },
    { id: 5, icon: <AppstoreOutlined />, label: "Phụ Kiện" },
    { id: 6, icon: <DollarOutlined />, label: "Mua Trả Góp" },
    { id: 7, icon: <AppstoreOutlined />, label: "Công Nghệ" },
    { id: 8, icon: <QuestionCircleOutlined />, label: "Liên Hệ" },
];

function ContentPage() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await ProductHandleApi(
                `/api/product/getProductByCategoryID?categoryID=1`, 
                {}, 
                'get'
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const debounce = (fn: () => void, delay: number) => {
        let timeout: NodeJS.Timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(fn, delay);
        };
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const handleResize = debounce(() => setWindowWidth(window.innerWidth), 300);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleCategoryClick = (categoryID: number) => {
        navigate(`/product/category/${categoryID}`);
    };

    const handleProductClick = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price).replace('₫', 'đ');
    };

    const renderCategories = () => {
        return categories.map((category) => (
            <div
                key={category.id}
                className="flex flex-col items-center space-y-2 min-w-fit"
                onClick={() => handleCategoryClick(category.id)}
            >
                <div className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm overflow-hidden border">
                    {category.icon}
                </div>
                <span className="text-xs text-center font-medium text-black">
                    {category.label}
                </span>
            </div>
        ));
    };

    const renderProductGroup = (model: string, products: IProduct[]) => (
        <div className="mb-8 mt-8" key={model}>
            <div className="relative mb-2">
                <div className="flex flex-col">
                    <div className="relative w-fit">
                        <div className="bg-[#FFA500] flex items-center h-8">
                            <div className="flex items-center pl-2.5 pr-4">
                                <Apple className="w-3.5 h-3.5 text-white" />
                                <span className="text-white text-[13px] font-medium uppercase tracking-wider ml-2.5">
                                    IPhone {model}
                                </span>
                            </div>
                            <div
                                className="absolute top-0 right-[-7px] h-full w-[8px] bg-[#FFA500]"
                                style={{
                                    clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
                                }}
                            />
                        </div>
                    </div>
                    <div className="h-[2px] bg-[#FFA500] flex-grow mb-[0px]" />
                </div>
            </div>

            <div
                className="grid gap-1"
                style={{
                    gridTemplateColumns: `repeat(${windowWidth <= 768 ? 2 : 6}, minmax(180px, 1fr))`,
                    maxWidth: '100%',
                }}
            >
                {products.slice(0, windowWidth <= 768 ? 2 : 6).map((product) => (
                    <div
                        className="border border-transparent hover:border-[#FFA500] rounded-sm p-3 transition-colors cursor-pointer"
                        key={product.productID}
                        onClick={() => handleProductClick(product.productID)}
                    >
                        <div className="relative mb-2">
                            <img
                                src={product.image}
                                alt={product.productName}
                                loading="lazy"
                                className="w-full h-[200px] object-contain rounded-md"
                            />
                        </div>
                        <h3 className="text-sm font-medium mb-2 group-hover:text-[#FFA500] truncate">
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
    );

    const groupedProducts = groupByModel(products);

    return (
        <Content className="container mx-auto py-6">
            <Row gutter={[24, 24]}>
                <Col span={24} lg={18}>
                    <Banner />
                    <div className="w-full flex justify-center overflow-x-auto rounded-lg pl-3 mt-4 mb-4 scroll-smooth">
                        <div className="flex space-x-4 p-4 lg:hidden flex-nowrap">
                            {renderCategories()}
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
                                Object.keys(groupedProducts).map((model) =>
                                    renderProductGroup(model, groupedProducts[model])
                                )
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
