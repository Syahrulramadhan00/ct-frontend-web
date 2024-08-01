export const useEmailOtp = defineStore("emailOtp", () => {
  const email = ref(false);
  const getEmail = computed(() => email.value);
  function setEmailOtp(value) {
    email.value = value;
  }

  return { email, setEmailOtp, getEmail };
});
