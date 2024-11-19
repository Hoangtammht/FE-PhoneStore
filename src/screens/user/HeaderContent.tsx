interface HeaderContentProps {
    models: { name: string; image: string }[];
    onModelSelect: (model: string) => void;  // Thêm prop mới
}

function HeaderContent({ models, onModelSelect }: HeaderContentProps) {
    return (
        <>
            <div className="relative h-32 bg-yellow-400 rounded-lg overflow-hidden">
                <img
                    src="https://media.vneconomy.vn/w800/images/upload/2024/09/10/apple-iphone-16-pro-series.jpg"
                    alt="Trade-in Promotion"
                    className="object-cover w-full h-full"
                />
            </div>

            <div className="w-full flex justify-center overflow-x-auto rounded-lg border mt-4 mb-4">
                <div className="flex w-max space-x-4 p-4">
                    {models.map((model) => (
                        <div
                            key={model.name}
                            className="flex flex-col items-center space-y-2"
                            onClick={() => onModelSelect(model.name)}
                        >
                            <div className="relative w-20 h-20 rounded-full bg-white shadow-sm overflow-hidden border">
                                <img
                                    src={model.image || 'https://media.vneconomy.vn/w800/images/upload/2024/09/10/apple-iphone-16-pro-series.jpg'}
                                    alt={model.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <span className="text-sm text-center font-medium group-hover:text-primary">{model.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default HeaderContent