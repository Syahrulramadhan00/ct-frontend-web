import FetchUtils from "~/composables/FetchUtils";

export const DeliveryApi = () => {
    const {fetchApi, res, url, pending, method, body} = FetchUtils();
    const {formatDate} = Util();

    async function getInvoices() {
        res.value = [];
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

    async function getDeliveries() {
        res.value = [];
        url.value = "get-all-delivery";
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();
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
        lockDelivery
    };
};
