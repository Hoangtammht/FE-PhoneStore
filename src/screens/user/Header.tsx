import { Menu, Input, Dropdown } from 'antd';
import { PhoneOutlined, TabletOutlined, LaptopOutlined, AppstoreOutlined, DollarOutlined, QuestionCircleOutlined, ClockCircleOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Drawer } from 'antd';
import ProductHandleApi from '../../apis/ProductHandleApi';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import './Header.css';

const { SubMenu } = Menu;

interface IProduct {
    productID: string;
    categoryID: number;
    productName: string;
    image: string;
    description: string;
    price: number;
    stock: number;
    status: number;
}

type GroupedProducts = {
    [model: string]: {
        productID: string;
        categoryID: number;
        productName: string;
    }[];
};


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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
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
        navigate('/homepage');
    };

    const handleProductClick = (categoryID: any) => {
        navigate(`/product/category/${categoryID}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchValue(query);
        debouncedSearch(query);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
    }

    const toggleSubMenu = (key: string) => {
        setActiveSubMenu(activeSubMenu === key ? null : key);
    };

    const renderSubMenu = (categoryID: number, groupedProducts: GroupedProducts) => {
        return (
            <ul className="pl-4 space-y-2">
                {Object.entries(groupedProducts).map(([model, products]) => {
                    const typedProducts = products as {
                        productID: string;
                        categoryID: number;
                        productName: string;
                    }[];

                    return (
                        typedProducts[0].categoryID === categoryID && (
                            <li key={model}>
                                <div className="font-semibold text-gray-700">{model}</div>
                                <ul className="pl-4 space-y-1">
                                    {typedProducts.map((product) => (
                                        <li
                                            key={product.productID}
                                            onClick={() => handleMenuItemClick(`/product/${product.productID}`)}
                                            className="cursor-pointer text-gray-600 hover:text-black"
                                        >
                                            {product.productName}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )
                    );
                })}
            </ul>
        );
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
        <header className="bg-[#FFA500] text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <div className="lg:hidden flex items-center mr-2">
                    <MenuOutlined
                        className="text-xl cursor-pointer"
                        onClick={handleMenuToggle}
                    />
                </div>
                <div className="bg-black p-4 inline-flex items-center space-x-8 rounded-md w-full lg:w-auto">
                <h1
                        className="text-lg font-bold text-white cursor-pointer"
                        onClick={handleLogoClick}
                    >
                        camphone
                    </h1>
                    <div className="flex items-center space-x-2 w-full">
                        <Dropdown overlay={searchMenu} trigger={['click']}>
                            <Input
                                type="search"
                                placeholder="Bạn tìm gì..."
                                className="w-full sm:w-full md:w-96 lg:w-64"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                        </Dropdown>
                    </div>
                </div>



                <Menu
                    mode="horizontal"
                    className="bg-[#FFA500] text-white border-0 hidden lg:block"
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
                    <SubMenu key="watch" icon={<ClockCircleOutlined />} title="APPLE WATCH" className="text-white" onTitleClick={() => handleProductClick(4)}>
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

                <Drawer
                    title="Menu"
                    placement="left"
                    onClose={handleMenuToggle}
                    open={isMenuOpen}
                    className="lg:hidden"
                >
                    <ul className="flex flex-col space-y-2">
                        <li>
                            <div
                                className="flex justify-between items-center py-2 px-3 border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => toggleSubMenu('phone')}
                            >
                                <span className="font-medium text-gray-800">Điện Thoại</span>
                                <span>{activeSubMenu === 'phone' ? '▲' : '▼'}</span>
                            </div>
                            {activeSubMenu === 'phone' && (
                                <div className="bg-gray-50 py-2">
                                    {renderSubMenu(1, groupedProducts)}
                                </div>
                            )}
                        </li>

                        <li>
                            <div
                                className="flex justify-between items-center py-2 px-3 border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => toggleSubMenu('tablet')}
                            >
                                <span className="font-medium text-gray-800">Tablet</span>
                                <span>{activeSubMenu === 'tablet' ? '▲' : '▼'}</span>
                            </div>
                            {activeSubMenu === 'tablet' && (
                                <div className="bg-gray-50 py-2">
                                    {renderSubMenu(2, groupedProducts)}
                                </div>
                            )}
                        </li>

                        <li>
                            <div
                                className="flex justify-between items-center py-2 px-3 border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => toggleSubMenu('macbook')}
                            >
                                <span className="font-medium text-gray-800">Macbook</span>
                                <span>{activeSubMenu === 'macbook' ? '▲' : '▼'}</span>
                            </div>
                            {activeSubMenu === 'macbook' && (
                                <div className="bg-gray-50 py-2">
                                    {renderSubMenu(3, groupedProducts)}
                                </div>
                            )}
                        </li>

                        <li>
                            <div
                                className="flex justify-between items-center py-2 px-3 border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => toggleSubMenu('watch')}
                            >
                                <span className="font-medium text-gray-800">Apple Watch</span>
                                <span>{activeSubMenu === 'watch' ? '▲' : '▼'}</span>
                            </div>
                            {activeSubMenu === 'watch' && (
                                <div className="bg-gray-50 py-2">
                                    {renderSubMenu(4, groupedProducts)}
                                </div>
                            )}
                        </li>

                        <li>
                            <div
                                className="flex justify-between items-center py-2 px-3 border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => toggleSubMenu('accessories')}
                            >
                                <span className="font-medium text-gray-800">Phụ Kiện</span>
                                <span>{activeSubMenu === 'accessories' ? '▲' : '▼'}</span>
                            </div>
                            {activeSubMenu === 'accessories' && (
                                <div className="bg-gray-50 py-2">
                                    {renderSubMenu(5, groupedProducts)}
                                </div>
                            )}
                        </li>

                        {/* Các mục khác */}
                        <li
                            onClick={() => handleMenuItemClick('/installment')}
                            className="py-2 px-3 border-b hover:bg-gray-100 cursor-pointer"
                        >
                            <span className="font-medium text-gray-800">Mua Trả Góp</span>
                        </li>
                        <li
                            onClick={() => handleMenuItemClick('/tech')}
                            className="py-2 px-3 border-b hover:bg-gray-100 cursor-pointer"
                        >
                            <span className="font-medium text-gray-800">Công Nghệ</span>
                        </li>
                        <li
                            onClick={() => handleMenuItemClick('/contact')}
                            className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                        >
                            <span className="font-medium text-gray-800">Liên Hệ</span>
                        </li>
                    </ul>
                </Drawer>


            </div>
        </header>
    );
}

export default Header;
