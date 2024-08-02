export default defineNuxtRouteMiddleware((to, from) => {
  const tokenCookie = useCookie("token");
  if (tokenCookie.value == null) {
    tokenCookie.value = "";
  }

  if (tokenCookie.value != "") {
    return navigateTo("/");
  }
});
