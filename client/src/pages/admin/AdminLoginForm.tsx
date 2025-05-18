import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../graphql/auth";
import useAuthStore from "../../store/adminAuthStore";
import { saveToken } from "../../utils/authService";
import { useNavigate } from "react-router-dom";
import LoginTemplate from "../../components/LoginTemplate";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginAdmin = useAuthStore((state) => state.loginAdmin);
  const isAdminAuthenticated = useAuthStore(
    (state) => state.isAdminAuthenticated
  );
  const adminSession = useAuthStore((state) => state.adminSession);

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      const { token, user: userData } = data.login;

      if (userData.role !== "ADMIN") {
        setError("Access denied. This login is for admins only.");
        setLoading(false);
        return;
      }

      saveToken(token);
      loginAdmin(token, userData);
      navigate("/admin");
    } catch {
      setError("Invalid credentials or not an admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated && adminSession) {
      navigate("/admin");
    }
  }, [isAdminAuthenticated, adminSession, navigate]);

  return (
    <LoginTemplate
      title="Admin Login"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
      handleLogin={handleLogin}
      isAuthenticated={isAdminAuthenticated}
    />
  );
};

export default AdminLoginForm;
