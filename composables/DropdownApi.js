import FetchUtils from "~/composables/FetchUtils";

export const DropdownApi = () => { 
    const { fetchApi, res, url, queryParams , pending, method } = FetchUtils();

    async function getDropdownData() {
        res.value = [];
        url.value = "get-available-months";
        queryParams.value = { table: "sales" };
        method.value = "GET";
    
        await fetchApi();
        if (res.value.status === 200) {
            const body = await res.value.json();
            console.log(body)
            if (body && body.labels && body.months) {
                return body.labels.map((label, index) => ({
                    label,
                    value: body.months[index]
                }));
            }
        }
        return [];
    }
    

    return { getDropdownData };
};
