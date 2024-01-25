import axios from "axios";
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const token = useCookie('token')

  let api = createAxiosInstance();
  function createAxiosInstance() {
    const instance = axios.create({
      baseURL: config.public.apiUrl,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    return instance;
  }

  return {
    provide: {
      api: api,
    },
  };
});
