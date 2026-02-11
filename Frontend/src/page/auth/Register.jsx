import { useNavigate } from 'react-router';
import { Button, Checkbox, Form, Input, Divider } from 'antd';
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import { useMutation } from "@tanstack/react-query";
import { registerMutationFn } from '../../lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  })

  const onFinish = (values) => {
    console.log('Registration Data:', values);

    mutate(values, {
      onSuccess: (data) => {
        console.log('Register successful:', data);
        navigate(`/home`);
      },
      onError: (error) => {
        console.error('Registration failed', error);
      }
    })

  };

  return (
    <div className='w-full max-w-md p-8 bg-white rounded-xl shadow-lg'>
      <Form
        form={form}
        name="register"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* Name Field */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="John Doe" size="large" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="example@mail.com" size="large" />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="******" size="large" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>I agree to terms and conditions</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            className="h-10 text-lg font-medium"
            icon={isPending ? <LoadingOutlined /> : <LoginOutlined />}
            type="primary"
            htmlType="submit"
            block>
            Register
          </Button>
        </Form.Item>

        <Divider plain>or</Divider>

        <div className="text-center mt-4">
          <Button type="default" block onClick={() => navigate("/login")} size="large">
            Already have an account? Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;