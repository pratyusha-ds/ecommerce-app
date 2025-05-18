import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/auth";
import useAuthStore from "../store/userAuthStore";
import useCartStore from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/authService";
import LoginTemplate from "../components/LoginTemplate";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const login = useAuthStore((state) => state.loginUser);
  const logout = useAuthStore((state) => state.logoutUser);
  const user = useAuthStore((state) => state.userSession);
  const isAuthenticated = useAuthStore((state) => state.isUserAuthenticated);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const setCart = useCartStore((state) => state.setCart);
  const setCartTransferred = useCartStore((state) => state.setCartTransferred);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const cartToken = localStorage.getItem("cart_token");
      const { data } = await loginMutation({
        variables: { email, password, cartToken },
      });

      if (data?.login) {
        const { token, user: userData, cart } = data.login;
        if (userData.role !== "USER") {
          setError("Please create a user account.");
          setLoading(false);
          return;
        }
        saveToken(token);
        login(token, userData);
        setCart(cart);
        setCartTransferred(true);
        localStorage.removeItem("cart_token");

        navigate(userData.role === "ADMIN" ? "/admin" : "/");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    clearCart();
    useCartStore.getState().setCartTransferred(false);
    localStorage.removeItem("cart-store");
    navigate("/login");
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role?.toLowerCase() === "admin" ? "/admin" : "/");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <LoginTemplate
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
      handleLogin={handleLogin}
      isAuthenticated={isAuthenticated}
      handleLogout={handleLogout}
    />
  );
};

export default LoginForm;
