import { Button, Card, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { apiPost } from "@/api/client";
import { useAuthStore } from "@/stores/auth";

type LoginResponse = { access_token: string };

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  async function onFinish(values: { email: string; password: string }) {
    try {
      const res = await apiPost<LoginResponse>("/auth/login", values);
      setSession(res.access_token);
      navigate("/console");
    } catch {
      message.error("Invalid email or password");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Card style={{ width: 400 }}>
        <Typography.Title level={4}>{import.meta.env.VITE_APP_TITLE}</Typography.Title>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ email: "demo@tradedesk.dev" }}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
}
