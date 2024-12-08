import { Layout, Row, Col, InputNumber, Button, Form } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderContent from './HeaderContent';
import { useState, useEffect } from 'react';
import ProductHandleApi from '../../apis/ProductHandleApi';
import { Apple } from 'lucide-react';

const { Content } = Layout;

interface IProduct {
    productID: string;
    categoryID: number;
    productName: string;
    image: string;
    description: string;
    price: number;
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
    const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number | undefined, max: number | undefined }>({
        min: undefined,
        max: undefined,
    });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price).replace('₫', 'đ');
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const groupedProducts = groupByModel(products);

    const filteredGroupedProducts = selectedModel
        ? Object.keys(groupedProducts).reduce((acc, model) => {
            if (model.toLowerCase().includes(selectedModel.toLowerCase())) {
                acc[model] = groupedProducts[model];
            }
            return acc;
        }, {} as Record<string, IProduct[]>)
        : groupedProducts;

    const filteredByPrice = filteredGroupedProducts && Object.keys(filteredGroupedProducts).reduce((acc, model) => {
        acc[model] = filteredGroupedProducts[model].filter(product => {
            const isWithinPriceRange = (selectedPriceRange.min ? product.price >= selectedPriceRange.min : true) &&
                (selectedPriceRange.max ? product.price <= selectedPriceRange.max : true);
            return isWithinPriceRange;
        });
        return acc;
    }, {} as Record<string, IProduct[]>);

    const handlePriceFilter = () => {
        setSelectedPriceRange({
            min: selectedPriceRange.min,
            max: selectedPriceRange.max,
        });
    };

    return (
        <Content className="container mx-auto py-6">
            <Row gutter={[24, 24]}>
                <Col span={24}>
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

                    <Form.Item label="Khoảng giá">
                        <Row gutter={[16, 16]} justify="center">
                            <Col xs={24} sm={10}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Giá từ"
                                    value={selectedPriceRange.min}
                                    onChange={(value) =>
                                        setSelectedPriceRange((prev) => ({
                                            ...prev,
                                            min: value !== undefined && value !== null ? value : undefined,
                                        }))
                                    }
                                    min={0}
                                />
                            </Col>
                            <Col xs={24} sm={10}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Giá đến"
                                    value={selectedPriceRange.max}
                                    onChange={(value) =>
                                        setSelectedPriceRange((prev) => ({
                                            ...prev,
                                            max: value !== undefined && value !== null ? value : undefined,
                                        }))
                                    }
                                    min={0}
                                />
                            </Col>
                            <Col xs={24} sm={4}>
                                <Button
                                    type="primary"
                                    style={{ width: '100%' }}
                                    onClick={handlePriceFilter}
                                >
                                    Áp dụng
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>

                    {Object.keys(filteredByPrice).map((model) => (
                        filteredByPrice[model].length > 0 && (
                            <div className="mb-8" key={model}>
                                <div className="relative mb-2">
                                    <div className="flex flex-col">
                                        <div className="relative w-fit">
                                            <div className="bg-[#FFA500] flex items-center h-8">
                                                <div className="flex items-center pl-2.5 pr-4">
                                                    <Apple className="w-3.5 h-3.5 text-white" />
                                                    <span className="text-white text-[13px] font-medium uppercase tracking-wider ml-2.5">
                                                        {model.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                                        gridTemplateColumns: 'repeat(6, minmax(180px, 1fr))',
                                        maxWidth: '100%',
                                    }}
                                >
                                    {filteredByPrice[model].slice(0, window.innerWidth <= 768 ? 2 : 6).map((product) => (
                                        <div
                                            className="border border-transparent hover:border-[#FFA500] rounded-sm p-3 transition-colors"
                                            key={product.productID}
                                            onClick={() => handleProductClick(product.productID)}
                                        >
                                            <div className="relative mb-2">
                                                <img
                                                    src={product.image}
                                                    alt={product.productName}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-[200px] object-contain rounded-md"
                                                />
                                            </div>
                                            <h3 className="text-sm font-medium mb-2 group-hover:text-[#FFA500]">
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
                        )
                    ))}


                </Col>

            </Row>
        </Content>
    );
}

export default ProductByCategory;
