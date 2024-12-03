import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import ProductHandleApi from 'apis/ProductHandleApi';
import { localDataNames } from 'constants/appInfos';
import { addAuth } from 'reduxs/reducers/authReducer';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue({ userName: '' });
    form.getFieldInstance('userName').focus();
  }, [form]);

  const handleLogin = async (values: { userName: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await ProductHandleApi('/api/user/loginUser', values, 'post');
      if (res.data?.User) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(res.data));
        dispatch(
          addAuth({
            access_token: res.data.access_token,
            userID: res.data.User.userID,
            userName: res.data.User.userName,
            role: res.data.User.roleID,
          })
        );
        message.success('Đăng nhập thành công!');
      } else {
        throw new Error('Thông tin đăng nhập không hợp lệ.');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error_message || 'Tài khoản hoặc mật khẩu không chính xác.';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 animate__animated animate__fadeIn">
          Quản trị viên
        </h2>

        <Form
          form={form}
          name="login_form"
          onFinish={handleLogin}
          className="space-y-6"
        >
          <Form.Item
            name="userName"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Tài khoản"
              className="py-2 px-3 border border-gray-300 rounded-md transition duration-300 focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              className="py-2 px-3 border border-gray-300 rounded-md transition duration-300 focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 py-2 transition duration-300 transform hover:scale-105"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
