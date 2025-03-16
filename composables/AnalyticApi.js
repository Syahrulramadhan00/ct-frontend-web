import FetchUtils from "~/composables/FetchUtils";

export const AnalyticApi = () => {
  const { fetchApi, res, url, queryParams, pending, method } = FetchUtils();

  async function getRevenueStream() {
    res.value = [];
    url.value = "get-revenue-stream";
    method.value = "GET";
    queryParams.value = { startDate: "2025-01", endDate: "2025-06" };

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
  
  async function getExpenses() {
    res.value = [];
    url.value = "get-expenses";
    queryParams.value = { startDate: "2025-01", endDate: "2025-06" };
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

  return { res, pending, getRevenueStream, getStockMonitoring, getHighestSales, getExpenses, getTopSpenders };
};