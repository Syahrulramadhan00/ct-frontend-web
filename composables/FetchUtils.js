import { ref } from "vue";
import { useRouter } from "vue-router";

export default function FetchUtils() {
  const res = ref([]);

  const method = ref("GET");
  const body = ref({});
  const url = ref("");
  const router = useRouter();

  const baseApiUrl = useRuntimeConfig().public.apiBaseUrl;
  const apiUrlString = typeof baseApiUrl === "string" ? baseApiUrl : "";

  const fetchApi = async () => {
    try {
      let response = null;

      if (method.value === "GET") {
        response = await fetch(`${apiUrlString}/${url.value}`, {
          method: method.value,
          headers: {
            "Content-Type": "application/json",
            Authorization: "",
          },
        });
      } else {
        response = await fetch(`${apiUrlString}/${url.value}`, {
          method: method.value,
          body: body.value,
          headers: {
            "Content-Type": "application/json",
            Authorization: "",
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

      const data = await response.json();
      res.value = data;
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return { res, fetchApi, method, body, url };
}
