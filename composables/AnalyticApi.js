import FetchUtils from "~/composables/FetchUtils";

export const AnalyticApi = () => {
  const { fetchApi, res, url, queryParams, pending, method } = FetchUtils();
  const {formatRupiah} = Util()

  async function getRevenueStream(startDateValue, endDateValue) {
    res.value = [];
    url.value = "get-revenue-stream";
    method.value = "GET";
    queryParams.value = { startDate: startDateValue, endDate: endDateValue };

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data;
    } else {
      return null;
    }
  }

  async function getStockMonitoring() {
    res.value = [];
    url.value = "get-stock-monitoring";
    method.value = "GET";
    queryParams.value = { yearMonth: "2025-02" };

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data;
    } else {
      return null;
    }
  }

  async function getHighestSales() {
    res.value = [];
    url.value = "get-highest-sales";
    method.value = "GET";
    queryParams.value = { yearMonth: "2025-02" };

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data;
    } else {
      return null;
    }
  }
  
  async function getExpenses(startDateValue, endDateValue) {
    res.value = [];
    url.value = "get-expenses";
    queryParams.value = { startDate: startDateValue, endDate: endDateValue };
    method.value = "GET";

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data;
    } else {
      return null;
    }
  }
  
  async function getTopSpenders() {
    res.value = [];
    url.value = "get-top-spenders";
    method.value = "GET";
    queryParams.value = { yearMonth: "2025-02" };

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data;
    } else {
      return null;
    }
  }


  async function getLatestBill() {
    res.value = [];
    url.value = "get-latest-bill";
    method.value = "GET";

    await fetchApi();
    if (res.value.status === 200) {
      const body = await res.value.json();
      return body.data.map((bill, index) => {
        return {
          code: bill.invoice_code,
          name: bill.client_name,
          amount: formatRupiah(bill.total_amount),
          contact: bill.client_contact,
          status: bill.payment_status,
        }
      } )
    } else {
      return [];
    }
  }
  
  return { res, pending, getRevenueStream, getStockMonitoring, getHighestSales, getExpenses, getTopSpenders,getLatestBill };
};