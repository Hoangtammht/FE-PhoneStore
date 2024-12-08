import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import ProductHandleApi from "../../apis/ProductHandleApi";

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

  return (
    <Carousel autoplay>
      {banners.map((banner) => (
        <div key={banner.bannerID}>
          <img
            src={banner.imageUrl || "https://media.vneconomy.vn/w800/images/upload/2024/09/10/apple-iphone-16-pro-series.jpg"}
            alt={banner.description}
            className="w-full h-[200px] sm:h-[300px] sm:w-full md:h-[320px] object-contain rounded-md cursor-pointer"
          />
        </div>
      ))}
    </Carousel>
  );
}

export default Banner;
