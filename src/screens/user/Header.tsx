import { Menu, Input, Button, Dropdown } from 'antd';
import { PhoneOutlined, TabletOutlined, LaptopOutlined, AppstoreOutlined, DollarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Watch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductHandleApi from '../../apis/ProductHandleApi';
import { useEffect, useState } from 'react';
import {debounce} from 'lodash'; 

const { SubMenu } = Menu;

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

function Header() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchResults, setSearchResults] = useState<IProduct[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const navigate = useNavigate();

    const fetchProducts = async (categoryID: number) => {
        try {
            const response = await ProductHandleApi(`/api/product/getProductByCategoryID?categoryID=${categoryID}`, {}, 'get');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            return [];
        }
    };

    const searchProducts = async (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await ProductHandleApi(`/api/product/getProductByName?productName=${query}`, {}, 'get');
            setSearchResults(response.data);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            setSearchResults([]);
        }
    };

    const debouncedSearch = debounce(searchProducts, 500);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const categoryIDs = [1, 2, 3, 4, 5];
                const allProducts = await Promise.all(categoryIDs.map(id => fetchProducts(id)));
                const mergedProducts = allProducts.flat();
                setProducts(mergedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Error loading products:", error);
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const groupedProducts = groupByModel(products);

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleProductClick = (categoryID: any) => {
        navigate(`/product/category/${categoryID}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchValue(query);
        debouncedSearch(query); 
    };

    const searchMenu = (
        <Menu>
            {searchResults.slice(0, 5).map(product => (
                <Menu.Item key={product.productID} onClick={() => navigate(`/product/${product.productID}`)}>
                    <div className="flex items-center space-x-2">
                        <img src={product.image} alt={product.productName} className="w-12 h-12 object-cover" />
                        <div>
                            <div>{product.productName}</div>
                            <div className="text-sm text-gray-500">{product.price.toLocaleString()} VND</div>
                        </div>
                    </div>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <header className="bg-orange-600 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="bg-black p-4 inline-flex items-center space-x-16 rounded-md">
                    <h1 className="text-2xl font-bold text-white mr-6 cursor-pointer" onClick={handleLogoClick}>
                        camphone
                    </h1>
                    <div className="flex items-center space-x-2">
                        <Dropdown overlay={searchMenu} trigger={['click']}>
                            <Input
                                type="search"
                                placeholder="Bạn tìm gì..."
                                className="w-64"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                        </Dropdown>
                    </div>
                </div>
                <Menu
                    mode="horizontal"
                    className="bg-orange-600 text-white border-0"
                >
                    <SubMenu key="phone" icon={<PhoneOutlined />} title="ĐIỆN THOẠI" className="text-white" onTitleClick={() => handleProductClick(1)}>
                        {Object.entries(groupedProducts).map(([model, products]) => (
                            products[0].categoryID === 1 && (
                                <SubMenu key={model} title={`${model}`} className="text-white">
                                    {products.map((product) => (
                                        <Menu.Item key={product.productID}>
                                            <div className="px-4 py-2 text-sm text-gray-700">{product.productName}</div>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            )
                        ))}
                    </SubMenu>
                    <SubMenu key="tablet" icon={<TabletOutlined />} title="TABLET" className="text-white" onTitleClick={() => handleProductClick(2)} >
                        {Object.entries(groupedProducts).map(([model, products]) => (
                            products[0].categoryID === 2 && (
                                <SubMenu key={model} title={`${model}`} className="text-white">
                                    {products.map((product) => (
                                        <Menu.Item key={product.productID}>
                                            <div className="px-4 py-2 text-sm text-gray-700">{product.productName}</div>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            )
                        ))}
                    </SubMenu>
                    <SubMenu key="macbook" icon={<LaptopOutlined />} title="MACBOOK" className="text-white" onTitleClick={() => handleProductClick(3)}>
                        {Object.entries(groupedProducts).map(([model, products]) => (
                            products[0].categoryID === 3 && (
                                <SubMenu key={model} title={`${model}`} className="text-white">
                                    {products.map((product) => (
                                        <Menu.Item key={product.productID}>
                                            <div className="px-4 py-2 text-sm text-gray-700">{product.productName}</div>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            )
                        ))}
                    </SubMenu>
                    <SubMenu key="watch" icon={<Watch />} title="APPLE WATCH" className="text-white" onTitleClick={() => handleProductClick(4)}>
                        {Object.entries(groupedProducts).map(([model, products]) => (
                            products[0].categoryID === 4 && (
                                <SubMenu key={model} title={`${model}`} className="text-white">
                                    {products.map((product) => (
                                        <Menu.Item key={product.productID}>
                                            <div className="px-4 py-2 text-sm text-gray-700">{product.productName}</div>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            )
                        ))}
                    </SubMenu>
                    <SubMenu key="accessories" icon={<AppstoreOutlined />} title="PHỤ KIỆN" className="text-white" onTitleClick={() => handleProductClick(5)}>
                        {Object.entries(groupedProducts).map(([model, products]) => (
                            products[0].categoryID === 5 && (
                                <SubMenu key={model} title={`${model}`} className="text-white">
                                    {products.map((product) => (
                                        <Menu.Item key={product.productID}>
                                            <div className="px-4 py-2 text-sm text-gray-700">{product.productName}</div>
                                        </Menu.Item>
                                    ))}
                                </SubMenu>
                            )
                        ))}
                    </SubMenu>
                    <Menu.Item key="installment" icon={<DollarOutlined />} className="text-white">MUA TRẢ GÓP</Menu.Item>
                    <Menu.Item key="tech" icon={<AppstoreOutlined />} className="text-white">CÔNG NGHỆ</Menu.Item>
                    <Menu.Item key="contact" icon={<QuestionCircleOutlined />} className="text-white">LIÊN HỆ</Menu.Item>
                </Menu>
            </div>
        </header>
    );
}

export default Header;
