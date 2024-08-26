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
          address : item.place,
          telephone : item.telephone
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

  async function addClient(data, callback) {
    res.value = [];
    url.value = "create-client";
    method.value = "POST";
    body.value = {
      name: data.name,
      address : data.address,
      telephone : data.telephone
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
      address : data.address,
      telephone : data.telephone
    };

    await fetchApi();
    callback();
  }

  return { res, pending, getClients, getReceiptClients, addClient, updateClient };
};
