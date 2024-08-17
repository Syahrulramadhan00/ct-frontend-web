import FetchUtils from "~/composables/FetchUtils";

export const ClientApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();

  async function getClients() {
    res.value = [];
    url.value = "get-all-client";
    method.value = "GET";

    await fetchApi();
    if (res.value.status == 200) {
      const body = await res.value.json();
      const data = body.data.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });

      return data;
    } else {
      return [];
    }
  }

  async function getReceiptClients() {
    res.value = [];
    url.value = "get-client-receipts";
    method.value = "GET";

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data;
    } else {
      return [];
    }
  }

  return { res, pending, getClients, getReceiptClients };
};
