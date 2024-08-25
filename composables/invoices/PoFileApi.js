export const PoFileApi = () => {
    const {adjustFile} = Util();

    const pending = ref(false);
    const error = ref(null);
    const result = ref(null);

    async function postFile(req , callback) {
        pending.value = true;
        try {
            const file = adjustFile(req.file);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("data", req.data);
            const baseApiUrl = useRuntimeConfig().public.apiBaseUrl;
            const apiUrlString = typeof baseApiUrl === "string" ? baseApiUrl : "";
            const {data, error} = await useFetch(`${apiUrlString}/update-po-file/${req.id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            })
            result.value = data.value;
            callback();
        } catch (e) {
            callback();
            error.value = e;
        } finally {
            pending.value = false;
        }
    }

    async function getUrl(req, callback) {
        pending.value = true;
        const baseApiUrl = useRuntimeConfig().public.apiBaseUrl;
        const apiUrlString = typeof baseApiUrl === "string" ? baseApiUrl : "";
        const {data, error} = await useFetch(`${apiUrlString}/get-po-url`, {
            method: 'POST',
            headers: {
                Authorization: localStorage.getItem("token"),
            },
            body : {
                key : req
            }
        })
        pending.value = false;
        result.value = data.value;
        callback();
    }

    return {pending, error, postFile, result, getUrl};
}