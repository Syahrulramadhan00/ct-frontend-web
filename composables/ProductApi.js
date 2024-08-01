import FetchUtils from "~/composables/FetchUtils";
import { useRouter } from "vue-router";

export const ProductApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();
  const router = useRouter();

  async function addProduct(nameData, fallback) {
    res.value = [];
    url.value = "add-product";
    method.value = "POST";

    body.value = {
      name: nameData,
    };

    await fetchApi();
    fallback();
  }

  async function getAllProduct() {
    res.value = [];
    url.value = "get-all-product";
    method.value = "GET";

    await fetchApi();
    if (res.value.status == 200) {
      const body = await res.value.json();
      const data = body.data.map((item, index) => {
        return {
          id: item.ID,
          no: index + 1,
          barang: item.Name,
          stok: item.Stock.toString(),
          status: item.Stock === 0 ? "Habis" : "Tersedia",
        };
      });

      return data;
    } else {
      return [];
    }
  }

  return { res, pending, addProduct, getAllProduct };
};
