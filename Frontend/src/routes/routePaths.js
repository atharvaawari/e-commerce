export const AUTH_ROUTES = ["/login", "/register"];

export const isAuthRoute = (pathname) => {
  return AUTH_ROUTES.includes(pathname);
};