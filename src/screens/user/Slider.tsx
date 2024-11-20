import ProductHandleApi from "../../apis/ProductHandleApi";
import { Card, Col, Typography } from "antd";
import { Apple } from "lucide-react";
import { useEffect, useState } from "react";
const { Title, Text } = Typography;

interface SliderProps {
  size: number;
}

type SliderData = {
  bannerID: number;
  imageUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

function Slider({ size }: SliderProps) {

  const [banners, setBanners] = useState<SliderData[]>([]);
  const [currentBanner, setCurrentBanner] = useState<SliderData | null>(null);

  useEffect(() => {
    ProductHandleApi(`/api/product/getBanner`)
      .then((response) => {
        const activeBanners = response.data.filter((banner: SliderData) => banner.active);
        // Limit the number of banners to 3
        const limitedBanners = activeBanners.slice(0, 3);
        setBanners(limitedBanners);

        if (limitedBanners.length > 0) {
          setCurrentBanner(limitedBanners[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
      });
  }, []);

  return (
    <Col span={size}>
      <div className="sticky top-4 hidden lg:block">
        <div className="relative">
          <div className="flex flex-col">
            <div className="relative w-fit">
              <div className="bg-[#006838] flex items-center h-8">
                <div className="flex items-center pl-2.5 pr-4">
                  <Apple className="w-4 h-4 text-white" />
                  <span className="text-white text-[13px] font-medium uppercase tracking-wider ml-2.5">TIN CÔNG NGHỆ</span>
                </div>
                <div
                  className="absolute top-0 right-[-7px] h-full w-[8px] bg-[#006838]"
                  style={{
                    clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
                  }}
                />
              </div>
            </div>
            <div className="h-[2px] bg-[#006838] flex-grow mb-[1px]" />
          </div>
        </div>

        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.bannerID} className="flex items-start gap-2 hover:bg-gray-50 p-2 rounded">
              <img
                src={banner.imageUrl || "/placeholder.svg?height=60&width=60"}
                alt="News thumbnail"
                className="w-20 h-20 object-contain rounded"
              />
              <Text className="text-sm hover:text-green-600">
                {banner.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Col>
  );
}

export default Slider;
