export const useForecastStore = defineStore('forecast', () => {
    const value = ref(null)

    function setForecast(data) {
        value.value = data
    }

    const getValue = computed(() => value.value)

    return {
        value,
        setForecast,
        getValue
    }
})
