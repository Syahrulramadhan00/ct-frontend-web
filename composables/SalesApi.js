import FetchUtils from "~/composables/FetchUtils";

export const SalesApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();

  async function addSales(salesData, fallback) {
    res.value = [];
    url.value = "add-sale-to-invoice";
    method.value = "POST";

    body.value = {
      invoice_id: salesData.invoiceId,
      product_id: salesData.productId,
      count: +salesData.count,
      price: +salesData.price,
    };

    await fetchApi();
    fallback();
  }

  async function getAllSales(invoiceIdData) {
    res.value = [];
    url.value = "get-all-sale/" + invoiceIdData;
    method.value = "GET";

    await fetchApi();

    if (res.value.status == 200) {
      const body = await res.value.json();
      const data = body.data.map((item, index) => {
        return {
          id: item.ID,
          no: index + 1,
          nama: item.Product.Name,
          jumlah: item.Quantity,
          harga: item.Price,
          total: item.Price * item.Quantity,
        };
      });

      return data;
    } else {
      return [];
    }
  }

  return { res, pending, addSales, getAllSales };
};
