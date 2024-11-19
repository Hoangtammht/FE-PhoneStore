import React, { useEffect, useState } from "react";
import { Typography, Carousel } from "antd";
import ProductHandleApi from "../../apis/ProductHandleApi";

const { Title, Text } = Typography;

type BannerData = {
  bannerID: number;
  imageUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

function Banner() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [currentBanner, setCurrentBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    ProductHandleApi(`/api/product/getBanner`)
      .then((response) => {
        const activeBanners = response.data.filter((banner: BannerData) => banner.active);
        setBanners(activeBanners);

        if (activeBanners.length > 0) {
          setCurrentBanner(activeBanners[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const dateParts = dateString.split(" ")[1].split("/");
    const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    return formattedDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  

  return (
    <div className="mb-8 rounded-lg overflow-hidden bg-yellow-400">
      <div className="relative p-6">
        <div className="flex items-center gap-8">
          <div className="flex-1">
            {currentBanner && (
              <>
                <Title level={2} className="text-red-600 mb-4">
                  {currentBanner.description}
                </Title>
                <div className="mt-4">
                  <Text className="text-sm text-gray-600">
                    <strong>Chương trình áp dụng từ: </strong>
                    {formatDate(currentBanner.startDate)}
                  </Text>
                  <br />
                  <Text className="text-sm text-gray-600">
                    <strong>Đến ngày: </strong>
                    {formatDate(currentBanner.endDate)}
                  </Text>
                </div>
              </>
            )}
          </div>
          <div className="flex-1 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
            <Carousel autoplay>
              {banners.map((banner) => (
                <div key={banner.bannerID}>
                  <img
                    src={banner.imageUrl || "https://media.vneconomy.vn/w800/images/upload/2024/09/10/apple-iphone-16-pro-series.jpg"}
                    alt={banner.description}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
