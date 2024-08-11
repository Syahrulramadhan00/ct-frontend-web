import FetchUtils from "~/composables/FetchUtils";

export const UserApi = () => {
    const {fetchApi, res, url, pending, method, body} = FetchUtils();

    async function getAllVerified() {
        res.value = [];
        url.value = "get-all-verified";
        method.value = "GET";

        await fetchApi();

        if (res.value.status === 200) {
            const body = await res.value.json();
            return body.data.map((item) => {
                return {
                    id: item.ID,
                    username: item.Name,
                }
            });
        } else {
            return [];
        }
    }

    return {pending,getAllVerified};
}