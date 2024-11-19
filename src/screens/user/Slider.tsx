import ProductHandleApi from "../../apis/ProductHandleApi";
import { Card, Col, Typography } from "antd";
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
      <Card className="sticky top-4">
        <Title level={4} className="text-green-600 mb-4">TIN CÔNG NGHỆ</Title>
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.bannerID} className="flex items-start gap-2 hover:bg-gray-50 p-2 rounded">
              <img
                src={banner.imageUrl || "/placeholder.svg?height=60&width=60"}
                alt="News thumbnail"
                className="w-14 h-14 object-cover rounded"
              />
              <Text className="text-sm hover:text-green-600">
                {banner.description}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </Col>
      );
}

export default Slider;
