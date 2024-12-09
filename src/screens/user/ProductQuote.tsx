import { useEffect, useState } from "react";
import { message, Spin, Select } from "antd";
import ProductHandleApi from "apis/ProductHandleApi";

const { Option } = Select;

interface Quote {
    quoteID: number;
    quoteCategory: string;
    imageUrl: string;
}

function ProductQuote() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const response = await ProductHandleApi(`/api/product/getListQuote`, {}, "get");
            setQuotes(response.data);

            const iphoneCategory = response.data.find((quote: Quote) => quote.quoteCategory === 'iPhone');
            if (iphoneCategory) {
                setSelectedCategory(iphoneCategory.quoteCategory);
            } else if (response.data.length > 0) {
                setSelectedCategory(response.data[0].quoteCategory);
            }
        } catch (error) {
            message.error("Không thể tải dữ liệu báo giá!");
        } finally {
            setLoading(false);
        }
    };

    const categories = [...new Set(quotes.map((quote) => quote.quoteCategory))];

    return (
        <div className="bg-teal-500 p-4 min-h-screen">
            {loading ? (
                <div className="flex justify-center items-center">
                    <Spin size="large" />
                </div>
            ) : (
                <div>
                    <div className="flex justify-center mb-6">
                        <Select
                            value={selectedCategory}
                            onChange={(value) => setSelectedCategory(value)}
                            className="w-64"
                            placeholder="Chọn loại sản phẩm"
                        >
                            {categories.map((category) => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {quotes
                        .filter((quote) => quote.quoteCategory === selectedCategory)
                        .map((quote) => (
                            <div key={quote.quoteID} className="rounded-lg mb-4">
                                <div className="h-64 flex justify-center items-center">
                                    <img
                                        alt={quote.quoteCategory}
                                        src={quote.imageUrl}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default ProductQuote;
