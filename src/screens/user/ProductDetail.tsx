import { useParams } from 'react-router-dom';
import { Card, Button, Badge, Table } from 'antd';
import { useEffect, useState } from 'react'
import { Star, Package, Clock, Shield, Truck } from 'lucide-react'
import Slider from './Slider';
import './ProductDetail.css'
import ProductHandleApi from '../../apis/ProductHandleApi';
import OrderNowModal from './OrderNowModal';

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

interface ColorOption {
    productColorID: number;
    colorName: string;
    price: number;
    imagePath: string;
    colorHex: string;
}

interface StorageOption {
    productStorageID: number
    storageCapacity: string
}

interface Promotion {
    productID: number;
    promotionDescription: string;
    discountValue: number;
    startDate: string;
    endDate: string;
    active: boolean;
}

interface Specification {
    productID: number;
    specName: string;
    specValue: string;
}

interface ProductVariant {
    variantID: number;
    productID: number;
    productColorID: number;
    productStorageID: number;
    price: number;
    stock: number;
}

const formatPrice = (price: number) => {
    if (price === undefined || isNaN(price)) {
        return '0';
    }
    return new Intl.NumberFormat('vi-VN').format(price)
}

const rowClassName = (record: any, index: number) => {
    return index % 2 === 0 ? 'table-row-white' : 'table-row-gray';
};

const columns = [
    {
        title: 'Thông số kỹ thuật',
        dataIndex: 'spec',
        key: 'spec',
        render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
        title: 'Chi tiết',
        dataIndex: 'detail',
        key: 'detail',
    },
];

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState<IProduct>();
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedStorage, setSelectedStorage] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedStorageID, setSelectedStorageID] = useState<number>(0);
    const [selectedColorID, setSelectedColorID] = useState<number>(0);
    const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
    const [storages, setStorages] = useState<StorageOption[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [specifications, setSpecifications] = useState<Specification[]>([]);
    const [productVariant, setProductVariant] = useState<ProductVariant | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await ProductHandleApi(`/api/product/${productId}`, {}, 'get');
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setLoading(false);
        }
    };

    const fetchColorOptions = async () => {
        try {
            const response = await ProductHandleApi(`/api/product/getColorOfProduct?productID=${productId}`);
            const data = response.data;
            const formattedColors = data.map((color: any) => ({
                ...color,
                image: `/placeholder.svg?height=80&width=80&color=${encodeURIComponent(color.colorHex)}`,
            }));
            setColorOptions(formattedColors);
        } catch (error) {
            console.error("Failed to fetch color options:", error);
        }
    };

    const fetchPromotions = async () => {
        try {
            const response = await ProductHandleApi(`/api/product/getPromotionOfProduct?productID=${productId}`);
            setPromotions(response.data);
        } catch (error) {
            console.error("Failed to fetch promotions:", error);
        }
    };

    const fetchSpecifications = async () => {
        try {
            const response = await ProductHandleApi(`/api/product/getSpecificationOfProduct?productID=${productId}`);
            setSpecifications(response.data);
        } catch (error) {
            console.error("Failed to fetch specifications:", error);
        }
    };

    const fetchStorages = async () => {
        try {
            const response = await ProductHandleApi(`/api/product/getProductStorage?productID=${productId}`);
            const uniqueStorages = response.data.filter((value: StorageOption, index: number, self: StorageOption[]) =>
                index === self.findIndex((t) => (
                    t.productStorageID === value.productStorageID,
                    t.storageCapacity === value.storageCapacity
                ))
            );
            setStorages(uniqueStorages);
        } catch (error) {
            console.error("Failed to fetch storage:", error);
        }
    };

    const fetchProductVariant = async () => {
        if (selectedColorID && selectedStorageID) {
            try {
                const response = await ProductHandleApi(`/api/product/getProductVariant?productColorID=${selectedColorID}&productID=${productId}&productStorageID=${selectedStorageID}`);
                setProductVariant(response.data);
            } catch (error) {
                console.error("Failed to fetch product variant:", error);
            }
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProducts();
            fetchColorOptions();
            fetchPromotions();
            fetchSpecifications();
            fetchStorages();
        }
    }, [productId]);

    useEffect(() => {
        if (storages.length > 0) {
            setSelectedStorage(storages[0].storageCapacity);
            setSelectedStorageID(storages[0].productStorageID);
        }
        if (colorOptions.length > 0) {
            setSelectedColor(colorOptions[0].colorName);
            setSelectedColorID(colorOptions[0].productColorID);
        }
    }, [storages, colorOptions]);

    useEffect(() => {
        if (selectedColorID && selectedStorageID) {
            fetchProductVariant();
        }
    }, [selectedColorID, selectedStorageID]);

    const formattedData = specifications.map((spec, index) => ({
        key: index.toString(),
        spec: spec.specName,
        detail: spec.specValue,
    }));

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleOrderSubmit = (formData: { name: string; phone: string; message: string }) => {
        handleModalClose();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="aspect-square relative">
                        <img
                            src={selectedColor && colorOptions.find(color => color.colorName === selectedColor)?.imagePath || product?.image}
                            alt={product?.productName}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color.colorName}
                                onClick={() => {
                                    setSelectedColorID(color.productColorID)
                                    setSelectedColor(color.colorName)
                                }}
                                className={`border-2 rounded-md p-1 ${selectedColor === color.colorName ? 'border-blue-500' : 'border-transparent'
                                    }`}
                            >
                                <img src={color.imagePath} alt={color.colorName} className="w-full aspect-square object-contain" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{product?.productName}</h1>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">14.213 đánh giá</span>
                            </div>
                            <div className="text-sm text-gray-600">124.400 lượt xem</div>
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-red-600">
                        {productVariant ? formatPrice(productVariant.price) : formatPrice(0)}đ
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2">Bạn đang xem phiên bản: {selectedStorage}</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {storages.map((storage) => (
                                <Button
                                    key={storage.productStorageID}
                                    type={selectedStorage === storage.storageCapacity ? "primary" : "default"}
                                    onClick={() => {
                                        setSelectedStorageID(storage.productStorageID);
                                        setSelectedStorage(storage.storageCapacity);
                                    }}
                                    className={`w-full flex justify-between ${selectedStorage === storage.storageCapacity ? "bg-orange-500 text-white hover:bg-orange-600" : "hover:bg-orange-100"
                                        }`}
                                >
                                    {storage.storageCapacity}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2">Màu sắc</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {colorOptions.map((color) => (
                                <Button
                                    key={color.colorName}
                                    type={selectedColor === color.colorName ? "primary" : "default"}
                                    onClick={() => {
                                        setSelectedColorID(color.productColorID)
                                        setSelectedColor(color.colorName)
                                    }}
                                    className={`w-full flex justify-between ${selectedColor === color.colorName ? "bg-orange-500 text-white hover:bg-orange-600" : "hover:bg-orange-100"
                                        }`}
                                >
                                    <span>{color.colorName}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Card className="bg-red-50 border-red-200">
                        <div className="p-4">
                            <h3 className="font-bold text-red-600 mb-2">Khuyến mãi khi mua</h3>
                            <ul className="space-y-2 text-sm">
                                {promotions.map((promo, index) => (
                                    <li key={index} className="flex gap-2">
                                        <span className="text-blue-600">{index + 1}</span>
                                        <span>{promo.promotionDescription} - Giảm {promo.discountValue}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200">
                        <div className="p-4 space-y-3">
                            <div className="flex items-start gap-2">
                                <Package className="w-5 h-5 text-blue-600" />
                                <span>Máy Likenew 99% gồm : Hộp, Sạc nhanh 18W, Cáp, Tai nghe.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span>Dùng thử 7 ngày "Miễn phí" (Trả máy hoàn 100% tiền)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span>60 ngày 1 ĐỔI 1, Bảo hành "toàn diện" 12 tháng tất cả phần cứng trên máy</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Truck className="w-5 h-5 text-blue-600" />
                                <span>Ship hàng nhanh chóng - Cài đặt & Thanh toán tại nhà</span>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            size="large"
                            className="bg-teal-600 hover:bg-teal-700 text-white w-full flex flex-col items-center"
                            onClick={showModal}
                        >
                            ĐẶT HÀNG NGAY
                        </Button>
                        {product && (
                            <OrderNowModal
                                isVisible={isModalVisible}
                                onClose={handleModalClose}
                                product={product}
                                colorOptions={colorOptions}
                                storages={storages}
                                selectedColor={selectedColor}
                                setSelectedColor={setSelectedColor}
                                selectedStorage={selectedStorage}
                                variantID={productVariant?.variantID}
                                setSelectedStorage={setSelectedStorage}
                                selectedColorID={selectedColorID}
                                setSelectedColorID={setSelectedColorID}
                                selectedStorageID={selectedStorageID}
                                setSelectedStorageID={setSelectedStorageID}
                                price={productVariant?.price}
                                onSubmit={handleOrderSubmit}
                            />
                        )}
                        <Button
                            size="large"
                            type="default"
                            className="border-blue-500 text-blue-500 w-full flex flex-col items-center"
                        >
                            MUA TRẢ GÓP
                        </Button>
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-gray-200">
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4 mt-8">
                    <p className="text-lg">
                        {product?.description}
                    </p>
                    <h1 className="text-2xl font-bold">{product?.productName}</h1>
                    <img
                        src={product?.image}
                        alt={product?.productName}
                        className="w-full h-[200px] object-contain rounded-md"
                    />
                </div>

                <div className="lg:col-span-1 space-y-4 mt-8">
                    <Card>
                        <div className="p-2">
                            <Table columns={columns} dataSource={formattedData} pagination={false} rowClassName={rowClassName} />
                        </div>
                    </Card>
                    <Slider size={24} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
