interface HeaderContentProps {
    models: { name: string; image: string }[];
    onModelSelect: (model: string) => void;
}

function HeaderContent({ models, onModelSelect }: HeaderContentProps) {
    return (
        <>
            <div className="flex bg-yellow-400 overflow-hidden">
                <img
                    src="https://hoangphucstore.com/assets/uploads/images/N93mG08l74r3_temp-002.jpg"
                    alt="Trade-in Promotion"
                    className="w-1/2 h-auto object-contain"
                />
                <img
                    src="https://hoangphucstore.com/assets/uploads/images/Xs7wGcaHdBm1_trangsp.jpg"
                    alt="Trade-in Promotion"
                    className="w-1/2 h-auto object-contain"
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
                                    className="object-contain w-full h-full"
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