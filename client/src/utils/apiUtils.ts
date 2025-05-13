const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getImageUrl = (imageUrl: string) => {
  return imageUrl.startsWith("http") ? imageUrl : `${backendUrl}${imageUrl}`;
};
