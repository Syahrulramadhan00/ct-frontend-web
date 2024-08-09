import FetchUtils from "~/composables/FetchUtils";

export const DeliveryApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();
  const { formatDate } = Util();

  async function getInvoices() {
    res.value = [];
    url.value = "delivery/get-available-invoices";
    method.value = "GET";

    await fetchApi();

    if (res.value.status == 200) {
      const body = await res.value.json();
      const data = body.data;

      return data;
    } else {
      return [];
    }
  }

  async function getDeliveries() {
    res.value = [];
    url.value = "get-all-delivery";
    method.value = "GET";

    await fetchApi();

    if (res.value.status == 200) {
      const body = await res.value.json();
      const data = body.data.map((item, index) => {
        return {
          id: item.ID,
          no: index + 1,
          kode: item.OrderCode,
          klien: item.ClientName,
          jumlah: item.Total,
          tanggal: formatDate(item.CreatedAt),
          status: item.Status,
          kodeStatus: item.StatusId,
        };
      });

      return data;
    } else {
      return [];
    }
  }

  async function createDelivery(invoiceId) {
    res.value = [];
    url.value = "create-delivery-order";
    method.value = "POST";
    body.value = {
      id: invoiceId,
    };

    await fetchApi();

    if (res.value.status == 200) {
      return true;
    } else {
      return false;
    }
  }

  async function getDelivery(deliveryId){
    res.value = [];
    url.value = `get-delivery/${deliveryId}`;
    method.value = "GET";

    await fetchApi();

    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data;
    } else {
      return [];
    }
  }

  return { res, pending, getInvoices, getDeliveries, createDelivery, getDelivery };
};
