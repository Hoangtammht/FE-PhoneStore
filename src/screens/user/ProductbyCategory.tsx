import { Layout, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderContent from './HeaderContent';
import { useState, useEffect } from 'react';
import ProductHandleApi from '../../apis/ProductHandleApi';
import { Apple } from 'lucide-react';

const { Content } = Layout;

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

    const handleProductClick = (productId: number) => {
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
                    {Object.keys(filteredGroupedProducts).map((model) => (
                        <div className="mb-8" key={model}>
                            <div className="relative mb-2">
                                <div className="flex flex-col">
                                    <div className="relative w-fit">
                                        <div className="bg-[#FFA500] flex items-center h-8">
                                            <div className="flex items-center pl-2.5 pr-4">
                                                <Apple className="w-3.5 h-3.5 text-white" />
                                                <span className="text-white text-[13px] font-medium uppercase tracking-wider ml-2.5">{model.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
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
                                {filteredGroupedProducts[model].slice(0, window.innerWidth <= 768 ? 2 : 6).map((product) => (
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
                    ))}

                </Col>

            </Row>
        </Content>
    );
}

export default ProductByCategory;
