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
    res.value = [];
    url.value = `get-invoice/${invoiceId}`;
    method.value = "GET";

    await fetchApi();

    if (res.value.status === 200) {
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

  async function updateMainInformation(invoiceData, fallback) {
    res.value = [];
    url.value = "update-main-information";
    method.value = "PUT";

    body.value = {
      invoice_id: invoiceData.invoice_id,
      po_code: invoiceData.po_code ?? "-",
      note: invoiceData.note,
      seller: invoiceData.seller,
      platform: invoiceData.platform,
      payment_method: invoiceData.payment_method,
      platform_description: invoiceData.platform_description,
      platform_number: invoiceData.platform_number,
      project : invoiceData.project,
      date : invoiceData.date
    };

    await fetchApi();
    fallback();
  }

  async function lockInvoice(invoiceId, fallback) {
    res.value = [];
    url.value = "lock-invoice";
    method.value = "POST";

    body.value = {
      id: invoiceId,
    };

    await fetchApi();
    fallback();
  }

  async function getReceiptInvoices(id) {
    res.value = [];
    url.value = `get-receipt-invoices/${id}`;
    method.value = "GET";

    await fetchApi();

    if (res.value.status == 200) {
      const body = await res.value.json();

      if (body.data == null) {
        return [];
      }

      return body.data;
    } else {
      return [];
    }
  }

  return {
    res,
    pending,
    createInvoice,
    getInvoices,
    getInvoice,
    updateFaktur,
    updateMainInformation,
    lockInvoice,
    getReceiptInvoices,
  };
};
