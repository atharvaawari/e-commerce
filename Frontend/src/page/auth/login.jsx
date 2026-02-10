import { Button, Checkbox, Form, Input, Divider, Typography } from 'antd';
import { GoogleOutlined, LoadingOutlined, LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { loginMutationFn } from '../../lib/api';

import { useAuthContext } from '../../context/AuthContext';

const { Text } = Typography;

const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [form] = Form.useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const onFinish = (values) => {

    mutate(values, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        login(data.accessToken, data.user);
        if (data.user.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
      },
      onError: (error) => {
        console.error('Login failed:', error);
      },

    });
    console.log('Login attempt with:', values);
  };

  const handleGoogleLogin = () => {
    console.log('Initiating Google Login...');
  };

  return (
    <div className='w-full max-w-md p-8 bg-white rounded-xl shadow-lg'>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold m-0">Welcome Back</h2>
        <Text type="secondary">Please enter your details to sign in</Text>
      </div>

      <Form
        form={form}
        name="login"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="example@mail.com"
            size="large"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="******"
            size="large"
          />
        </Form.Item>

        <div className="flex justify-between mb-6">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a href="#forgot" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block size="large"
            icon={isPending ? <LoadingOutlined /> : <LoginOutlined />}
            className="h-10 text-lg font-medium"
          >
            Sign In
          </Button>
        </Form.Item>

        <Divider plain><Text type="secondary" className="text-xs">OR</Text></Divider>

        <div className="text-center">
          <Text type="secondary">
            Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800">Register now</Link>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default Login;