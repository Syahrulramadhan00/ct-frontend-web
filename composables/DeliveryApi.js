import FetchUtils from "~/composables/FetchUtils";

export const DeliveryApi = () => {
    const {fetchApi, res, url, pending, method, body, queryParams} = FetchUtils();
    const {formatDate} = Util();

    const pageInfo = ref({});

    async function getInvoices() {
        res.value = [];
        queryParams.value = {};
        url.value = "delivery/get-available-invoices";
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();
          return body.data;
        } else {
            return [];
        }
    }

    async function getDeliveries(page) {
        res.value = [];
        url.value = "get-all-delivery";
        queryParams.value = {
            page: page ?? 1,
        };
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();
            pageInfo.value = body.meta;
          return body.data.map((item, index) => {
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

        return res.value.status === 200;
    }

    async function getDelivery(deliveryId) {
        res.value = [];
        url.value = `get-delivery/${deliveryId}`;
        queryParams.value = {};
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();
            return body.data;
        } else {
            return [];
        }
    }

    async function updateSender(deliveryData, fallback) {
        res.value = [];
        url.value = "update-sender";
        method.value = "PUT";
        body.value = {
            id: deliveryData.id,
            sender: deliveryData.sender,
        };

        await fetchApi();
        fallback();
    }

    async function updateDeliveryInformation(deliveryData, fallback) {
        res.value = [];
        url.value = "update-delivery-information";
        method.value = "PUT";
        body.value = {
            delivery_id: deliveryData.delivery_id,
            place: deliveryData.place,
            note: deliveryData.note,
        };

        await fetchApi();
        fallback();
    }

    async function getPreviousNote(id) {
        res.value = [];
        url.value = `get-previous-note/${id}`;
        queryParams.value = {};
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();
            return body.data;
        } else {
            return "tidak ada catatan";
        }
    }

    async function lockDelivery(deliveryData, fallback) {
        res.value = [];
        url.value = "lock-delivery-order";
        method.value = "PUT";
        body.value = {
            delivery_id: deliveryData.delivery_id,
            invoice_id: deliveryData.invoice_id
        };

        await fetchApi();
        fallback();
    }

    return {
        res,
        pending,
        getInvoices,
        getDeliveries,
        createDelivery,
        getDelivery,
        updateSender,
        updateDeliveryInformation,
        getPreviousNote,
        lockDelivery,
        pageInfo
    };
};
