import { ref } from "vue";
import { useRouter } from "vue-router";

export default function FetchUtils() {
  const res = ref([]);

  const method = ref("GET");
  const body = ref({});
  const url = ref("");
  const router = useRouter();
  const pending = ref(false);

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
        router.push("/auth");
        return;
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      res.value = response;
      return res;
    } catch (error) {
      console.error("[ERROR]:", error);
    } finally {
      pending.value = false;
    }
  };

  return { res, fetchApi, method, body, url, pending };
}
