export const PurchaseApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();
  const { formatDate } = Util();

  async function addPurchase(purchaseData, fallback) {
    res.value = [];
    url.value = "add-purchase";
    method.value = "POST";

    body.value = {
      product_id: purchaseData.productId,
      count: +purchaseData.count,
      price: +purchaseData.price,
      is_paid: purchaseData.isPaid,
    };

    await fetchApi();
    await fallback();
  }

  async function getAllPurchase() {
    res.value = [];
    url.value = "get-all-purchase";
    method.value = "GET";

    await fetchApi();

    if (res.value.status == 200) {
      const body = await res.value.json();
      const data = body.data.map((item, index) => {
        return {
          id: item.ID,
          no: index + 1,
          nama: item.Product.Name,
          jumlah: item.Count,
          harga: item.Price,
          total: item.Price * item.Count,
          tanggal: formatDate(item.CreatedAt),
          lunas: item.IsPaid,
        };
      });

      return data;
    } else {
      return [];
    }
  }

  async function deletePurchase(purchaseId, fallback) {
    res.value = [];
    url.value = "delete-purchase";
    method.value = "DELETE";
    body.value = {
      id: purchaseId,
    };

    await fetchApi();
    await fallback();
  }

  async function payDebt(purchaseId, fallback) {
    res.value = [];
    url.value = "pay-debt";
    method.value = "POST";
    body.value = {
      id: purchaseId,
    };

    await fetchApi();
    await fallback();
  }

  return { pending, addPurchase, getAllPurchase, deletePurchase, payDebt };
};
