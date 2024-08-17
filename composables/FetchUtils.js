import { ref } from "vue";
import { useRouter } from "vue-router";

export default function FetchUtils() {
  const res = ref([]);

  const method = ref("GET");
  const body = ref({});
  const url = ref("");
  const router = useRouter();
  const pending = ref(false);

  const err = ref(null);

  const baseApiUrl = useRuntimeConfig().public.apiBaseUrl;
  const apiUrlString = typeof baseApiUrl === "string" ? baseApiUrl : "";

  const tokenCookie = useCookie("token");
  if (tokenCookie.value == null) {
    tokenCookie.value = "";
  }

  const fetchApi = async () => {
    try {
      pending.value = true;
      let response = null;

      if (method.value === "GET") {
        response = await fetch(`${apiUrlString}/${url.value}`, {
          method: method.value,
          headers: {
            "Content-Type": "application/json",
            Authorization: tokenCookie.value,
          },
        });
      } else {
        response = await fetch(`${apiUrlString}/${url.value}`, {
          method: method.value,
          body: JSON.stringify(body.value),
          headers: {
            "Content-Type": "application/json",
            Authorization: tokenCookie.value,
          },
        });
      }

      if (response.status == 401) {
        tokenCookie.value = null;
        router.push("/auth");
        return;
      }

      res.value = response;
      return res;
    } catch (error) {
      err.value = error;
    } finally {
      if (err.value instanceof TypeError) {
        await router.push("/offline");
        console.error(`[ERROR]: Server tidak dapat dijangkau. `);
      } else {
        console.error("[ERROR]: Terjadi kesalahan lainnya.");
      }

      pending.value = false;
    }
  };

  return { res, fetchApi, method, body, url, pending };
}
