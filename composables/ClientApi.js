import FetchUtils from "~/composables/FetchUtils";

export const ClientApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();

  async function getClients() {
    res.value = [];
    url.value = "get-all-client";
    method.value = "GET";

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data.map((item, index) => {
        return {
          no: index + 1,
          id: item.id,
          name: item.name,
        };
      });
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

  async function addClient(name, callback) {
    res.value = [];
    url.value = "create-client";
    method.value = "POST";
    body.value = {
      name: name,
    };

    await fetchApi();
    callback();
  }

  async function updateClient(data, callback){
    res.value = [];
    url.value = "update-client";
    method.value = "PUT";
    body.value = {
      id: data.id,
      name: data.name,
    };

    await fetchApi();
    callback();
  }

  return { res, pending, getClients, getReceiptClients, addClient, updateClient };
};
