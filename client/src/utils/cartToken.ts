const CART_TOKEN_KEY = "cart_token";

export function getCartToken(): string {
  let token = localStorage.getItem(CART_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(CART_TOKEN_KEY, token);
  }
  console.log(localStorage.getItem(CART_TOKEN_KEY), "token!");
  return token;
}
