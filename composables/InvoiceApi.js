import FetchUtils from "~/composables/FetchUtils";

export const InvoiceApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();

  async function createInvoice(clientIdData, fallback) {
    res.value = [];
    url.value = "add-invoice";
    method.value = "POST";

    body.value = {
      client_id: clientIdData,
    };

    await fetchApi();

    if (res.value.status == 200) {
      await fallback();
    }
  }

  async function getInvoices() {
    res.value = [];
    url.value = "get-all-invoice";
    method.value = "GET";

    await fetchApi();
    if (res.value.status == 200) {
      const body = await res.value.json();

      if (body.data == null) {
        return [];
      }

      const data = body.data.map((item, index) => {
        return {
          id: item.ID,
          no: index + 1,
          kode: item.InvoiceCode,
          klien: item.ClientName,
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  async function getInvoice(invoiceId) {
    console.log("invoice");
    res.value = [];
    url.value = `get-invoice/${invoiceId}`;
    method.value = "GET";

    await fetchApi();

    if (res.value.status == 200) {
      const body = await res.value.json();
      return body.data;
    }
  }

  async function updateFaktur(invoiceData, fallback) {
    res.value = [];
    url.value = "update-faktur";
    method.value = "PUT";

    body.value = {
      invoice_id: invoiceData.invoice_id,
      discount: +invoiceData.discount,
      payment_term: +invoiceData.payment_term,
      is_taxable: invoiceData.is_taxable,
    };

    await fetchApi();
    fallback();
  }

  return { res, pending, createInvoice, getInvoices, getInvoice, updateFaktur };
};
