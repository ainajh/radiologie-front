export default defineNuxtRouteMiddleware((to) => {
  const { authenticated } = storeToRefs(useAuthStore());
  const token = useCookie("token");
  if (token.value) {
    authenticated.value = true;
  }

  if (token.value && to?.name === "authentification") {
    return navigateTo("/dashboard");
  }
  const user = useCookie("user").value;
  if (!token.value && to?.name !== "authentification") {
    abortNavigation();
    return navigateTo("/authentification");
  }
});
