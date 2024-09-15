export const ReceiptApi = () => {
    const {fetchApi, res, url, pending, method, body} = FetchUtils();
    const {formatDate} = Util();

    async function getReceipts() {
        res.value = [];
        url.value = "get-all-receipt";
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();
            return body.data.map((item, index) => {
                return {
                    id: item.ID,
                    no: index + 1,
                    klien: item.Client.name,
                    tanggal: formatDate(item.CreatedAt),
                    status: item.Status,
                    kode: item.Number
                };
            });
        } else {
            return [];
        }
    }

    async function addReceipt(id, fallback){
        res.value = [];
        url.value = "add-receipt";
        method.value = "POST";

        body.value = {
            id: id
        };

        await fetchApi();
        fallback();
    }

    async function getReceipt(id){
        res.value = [];
        url.value = `get-receipt/${id}`;
        method.value = "GET";


        await fetchApi();
        if (res.value.status === 200) {
            const body = await res.value.json();
            return body.data;
        } else {
            return null;
        }
    }

    async function getInvoices(receiptId){
        res.value = [];
        url.value = `get-invoice-by-receipt/${receiptId}`;
        method.value = "GET";

        await fetchApi();
        if (res.value.status === 200) {
            const body = await res.value.json();
            return body.data.map((item, index) => {
                return {
                    id: item.ID,
                    no: index + 1,
                    kode: item.Invoice.InvoiceCode,
                    jumlah: item.Invoice.TotalPrice,
                };
            });
        } else {
            return [];
        }
    }

    async function addInvoice(data, fallback){
        res.value = [];
        url.value = "add-invoice-to-receipt";
        method.value = "POST";

        body.value = {
            "invoice_id" : +data.invoiceId,
            "receipt_id" : +data.receiptId
        };

        await fetchApi();
        fallback();
    }

    async function deleteInvoice(id, fallback){
        res.value = [];
        url.value = `delete-invoice-receipt/${id}`;
        body.value = {};
        method.value = "DELETE";

        await fetchApi();
        fallback();
    }

    async function lockReceipt(id, fallback){
        res.value = [];
        url.value = `lock-receipt`;
        method.value = "POST";
        body.value = {
            id: +id
        };

        await fetchApi();
        fallback();
    }

    async function payReceipt(id, fallback){
        res.value = [];
        url.value = `pay-receipt`;
        method.value = "POST";
        body.value = {
            id: +id
        };

        await fetchApi();
        fallback();
    }

    return {pending, getReceipts, addReceipt, getReceipt, getInvoices, addInvoice, deleteInvoice, lockReceipt, payReceipt};
}