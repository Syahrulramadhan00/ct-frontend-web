export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: "http://localhost:8888/api",
    onRequest({ request, options, error }) {},
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo("/buy"));
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
