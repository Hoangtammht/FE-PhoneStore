const productData = [
    {
        series: "iPhone 15 Series",
        products: [
            { name: "15 128GB", price: "16.990.000", upfront: "1.699.000" },
            { name: "15 256GB", price: "19.990.000", upfront: "1.999.000" },
            { name: "15 Plus 128GB", price: "22.490.000", upfront: "4.498.000" },
            { name: "15 Plus 256GB", price: "24.990.000", upfront: "4.998.000" },
            { name: "15 Pro 128GB", price: "25.190.000", upfront: "5.038.000" },
            { name: "15 Pro 256GB", price: "26.890.000", upfront: "5.378.000" },
            { name: "15 Pro Max 512GB", price: "29.290.000", upfront: "5.858.000" },
        ],
    },
    {
        series: "iPhone 14 Series",
        products: [
            { name: "14 128GB", price: "12.790.000", upfront: "1.279.000" },
            { name: "14 256GB", price: "13.790.000", upfront: "1.379.000" },
            { name: "14 Plus 128GB", price: "13.490.000", upfront: "1.349.000" },
            { name: "14 Plus 256GB", price: "14.790.000", upfront: "1.479.000" },
            { name: "14 Pro 128GB", price: "15.290.000", upfront: "1.529.000" },
            { name: "14 Pro 256GB", price: "16.390.000", upfront: "1.639.000" },
            { name: "14 Pro Max 256GB", price: "19.290.000", upfront: "1.929.000" },
        ],
    },
];

function ProductQuote() {
    return (
        <div className="bg-teal-500 p-4">
            {productData.map((seriesData, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-4 mb-6 max-w-4xl mx-auto"
                >
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="text-lg font-semibold text-red-600">
                            🔴 {seriesData.series}
                        </h3>
                    </div>
                    <table className="w-full border-collapse border border-gray-300 text-sm text-gray-700">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Sản phẩm</th>
                                <th className="border border-gray-300 p-2">Giá bán</th>
                                <th className="border border-gray-300 p-2">Trả trước</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seriesData.products.map((product, idx) => (
                                <tr key={idx} className="text-center">
                                    <td className="border border-gray-300 p-2">{product.name}</td>
                                    <td className="border border-gray-300 p-2">{product.price}</td>
                                    <td className="border border-gray-300 p-2">{product.upfront}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default ProductQuote;
