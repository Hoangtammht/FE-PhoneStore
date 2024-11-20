import { PhoneOutlined, ClockCircleOutlined, EnvironmentOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Layout, Button, Typography, Row, Col, Carousel } from 'antd';
import type { CarouselRef } from 'antd/lib/carousel';
import React, { useEffect, useState } from 'react';
import ProductHandleApi from '../../apis/ProductHandleApi';

const { Title, Text, Link } = Typography;
const { Footer } = Layout;

interface CustomerImage {
  customerImageID: number;
  imageURL: string;
  createdAt: string;
}

function FooterPage() {
  const carouselRef = React.useRef<CarouselRef>(null);
  const [customerImages, setCustomerImages] = useState<CustomerImage[]>([]);

  useEffect(() => {
    ProductHandleApi(`/api/product/getCustomerVisitImage`, {}, 'get')
      .then((response) => {
        setCustomerImages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer images:', error);
      });
  }, []);

  return (
    <>
      <div className="mb-6 mt-12">
        <div className="flex justify-center mb-8">
          <h2 className="inline-flex items-center px-8 py-2 bg-orange-500 text-white font-bold text-xl rounded-md relative">
            <span className="absolute -left-3 w-6 h-6 bg-orange-500 transform rotate-45"></span>
            KHÁCH HÀNG TẠI camphone
            <span className="absolute -right-3 w-6 h-6 bg-orange-500 transform rotate-45"></span>
          </h2>
        </div>

        <div className="relative mx-auto border-2 border-orange-500 rounded-lg p-4 max-w-[1000px] h-[270px]">
          <Carousel
            ref={carouselRef}
            autoplay
            dots={false}
            slidesToShow={5}
            slidesToScroll={1}
            infinite
            centerMode
            centerPadding="0"
            responsive={[
              {
                breakpoint: 1024, // Web
                settings: {
                  slidesToShow: 5,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 2,
                },
              },
            ]}
          >
            {customerImages.map((image) => (
              <div
                key={image.customerImageID}
                className="flex justify-center items-center pr-4"
              >
                <img
                  src={image.imageURL}
                  alt={`Customer ${image.customerImageID}`}
                  className="w-[200px] h-[250px] sm:w-[180px] sm:h-[200px] object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>





      <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.6111722078827!2d106.68!3d10.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzM2LjAiTiAxMDbCsDQwJzQ4LjAiRQ!5e0!3m2!1sen!2s!4v1599999999999!5m2!1sen!2s"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>

      <Footer className="bg-black text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={8}>
              <Title level={4} className="text-yellow-500 mb-6 text-left">
                THÔNG TIN CỬA HÀNG
              </Title>
              <ul className="space-y-3 text-left">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Hướng dẫn mua hàng trả góp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Hướng dẫn mua hàng từ xa
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Chính sách bảo hành - Đổi trả
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Giới thiệu camphone
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Phản ánh khiếu nại - Góp ý
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Chính sách bảo mật thông tin
                  </Link>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Title level={4} className="text-yellow-500 mb-6 text-left">
                TỔNG ĐÀI CHĂM SÓC KHÁCH HÀNG
              </Title>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <PhoneOutlined className="text-green-500" />
                  <Text className="text-white">0931.692.639 - 0932.726.593</Text>
                </div>
                <div>
                  <Text className="text-gray-300">
                    Phản hồi chất lượng dịch vụ: 0906.712.639
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-blue-500" />
                  <Text className="text-gray-300">
                    Tất cả các showroom: Từ 09h00 - 21h00 (T7/7)
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <Title level={4} className="text-yellow-500 mb-6 text-left">
                ĐỊA CHỈ CỬA HÀNG
              </Title>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-2">
                  <EnvironmentOutlined className="text-red-500 mt-1" />
                  <Text className="text-white">
                    ........................................
                  </Text>
                </div>
                <Text className="text-gray-300">
                  camphone Store - Điện thoại iPhone, iPad, Macbook, Phụ kiện chính hãng
                </Text>
              </div>
            </Col>
          </Row>

          <div className="mt-12 pt-6 border-t border-gray-800 text-left">
            <Text className="text-gray-400">
              © 2024 camphone Store. All rights reserved.
            </Text>
          </div>
        </div>
      </Footer>
    </>

  );
}

export default FooterPage;
