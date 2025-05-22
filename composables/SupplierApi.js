import FetchUtils from "~/composables/FetchUtils";

export const SupplierApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();

  async function getAllSuppliers() {
    res.value = [];
    url.value = "get-all-supplier";
    method.value = "GET";

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data.map((supplier, index) => {
        return {
          no: index + 1,
          id: supplier.ID,
          name: supplier.Name,
          company: supplier.Company,
          address : supplier.Address,
          telephone : supplier.Telephone
        };
      });
    } else {
      return [];
    }
  }

  async function addSupplier(data, callback) {
    res.value = [];
    url.value = "create-supplier";
    method.value = "POST";
    body.value = {
      name: data.Name,
      company: data.Company,
      address : data.Address,
      telephone : data.Telephone
    };

    await fetchApi();
    callback();
  }

  async function updateSupplier(data, callback){
    res.value = [];
    url.value = "update-supplier";
    method.value = "PUT";
    body.value = {
      id: data.id,
      name: data.Name,
      company: data.Company,
      address : data.Address,
      telephone : data.Telephone
    };

    await fetchApi();
    callback();
  }

  return { res, pending, getAllSuppliers, addSupplier, updateSupplier };
};
