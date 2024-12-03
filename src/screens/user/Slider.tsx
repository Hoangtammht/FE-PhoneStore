import ProductHandleApi from "../../apis/ProductHandleApi";
import { Col, Typography } from "antd";
import { Apple } from "lucide-react";
import { useEffect, useState } from "react";
const { Text } = Typography;

interface SliderProps {
  size: number;
}

type NewData = {
  newID: number;
  imageURL: string;
  title: string;
  createdAt: string;
};

function Slider({ size }: SliderProps) {

  const [news, setNews] = useState<NewData[]>([]);
  const [currentBanner, setCurrentBanner] = useState<NewData | null>(null);

  useEffect(() => {
    ProductHandleApi(`/api/product/getNews`)
      .then((response) => {
        const limitedBanners = response.data;
        setNews(limitedBanners);
        if (limitedBanners.length > 0) {
          setCurrentBanner(limitedBanners[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  }, []);

  return (
    <Col span={size}>
      <div className="sticky top-4 hidden lg:block">

        <div className="relative">
          <div className="flex flex-col">
            <div className="relative w-fit">
              <div className="bg-[#FFA500] flex items-center h-8">
                <div className="flex items-center pl-2.5 pr-4">
                  <Apple className="w-4 h-4 text-white" />
                  <span className="text-white text-[13px] font-medium uppercase tracking-wider ml-2.5">TIN CÔNG NGHỆ</span>
                </div>
                <div
                  className="absolute top-0 right-[-7px] h-full w-[8px] bg-[#FFA500]"
                  style={{
                    clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
                  }}
                />
              </div>
            </div>
            <div className="h-[2px] bg-[#FFA500] flex-grow mb-[1px]" />
          </div>
        </div>

        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.newID}
              className="flex items-start justify-between gap-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
            >
              <Text className="text-sm hover:text-green-600 flex-grow">
                {item.title}
              </Text>

              <img
                src={item.imageURL || "/placeholder.svg?height=60&width=60"}
                alt="News thumbnail"
                className="w-20 h-20 md:h-[56px] md:w-[100px] object-fill"
              />
            </div>
          ))}
        </div>


      </div>
    </Col>
  );
}

export default Slider;
