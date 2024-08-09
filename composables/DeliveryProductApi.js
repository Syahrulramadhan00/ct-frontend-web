import FetchUtils from "~/composables/FetchUtils";

export const DeliveryProductApi = () => {
    const {fetchApi, res, url, pending, method, body} = FetchUtils();

    async function getDeliveryProducts(deliveryId) {
        res.value = [];
        url.value = "get-all-delivery-product/" + deliveryId;
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();

            if (body.data === null) {
                return [];
            }
            return body.data.map((item, index) => {
                return {
                    id: item.ID,
                    no: index + 1,
                    Name: item.Name,
                    Quantity: item.Quantity,
                    SaleId : item.SaleID
                }
            });
        } else {
            return [];
        }
    }

    async function createDeliveryProduct(deliveryData, fallback) {
        res.value = [];
        url.value = "create-delivery-product";
        method.value = "POST";
        body.value = {
            "delivery_id" : +deliveryData.id,
            "sales_id" : +deliveryData.salesId,
            "quantity" : +deliveryData.quantity
        };

        await fetchApi();
        fallback();
    }

    async function getAvailableSales(invoiceId) {
        res.value = [];
        url.value = "delivery/get-available-sales/" + invoiceId;
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();

            if (body.data === null) {
                return [];
            }
            
            return body.data.map((item) => {
                return {
                    id: item.ID,
                    Name: item.Product.Name,
                    Count: item.NotSentCount,
                }
            });
        } else {
            return [];
        }
    }

    async  function deleteDeliveryProduct(deliveryData, fallback) {
        res.value = [];
        url.value = "delete-delivery-product";
        method.value = "DELETE";
        body.value = {
            id: deliveryData.id,
            quantity : deliveryData.quantity,
            sale_id : deliveryData.saleId,
        };

        console.log(body.value);

        await fetchApi();
        fallback();
    }

    return {pending, getDeliveryProducts, createDeliveryProduct, getAvailableSales, deleteDeliveryProduct};
}