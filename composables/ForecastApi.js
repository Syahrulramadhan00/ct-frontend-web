import ForecastUtils from "~/composables/ForecastUtils";

export const ForecastApi = () => {
    const {fetchApi, res, url, pending, method, body, queryParams} = ForecastUtils();

    async function getForecast(query) {
        res.value = [];
        queryParams.value = query;
        url.value = "forecast";
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            return await res.value.json();
        } else {
            return [];
        }
    }

    async function getProduct(query) {
        res.value = [];
        queryParams.value = query;
        url.value = "product";
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            return await res.value.json();
        } else {
            return [];
        }
    }

    return {
        res,
        pending,
        getForecast,
        getProduct
    };
};
