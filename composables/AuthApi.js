import FetchUtils from "~/composables/FetchUtils";
import { useRouter } from "vue-router";
import { useEmailOtp } from "~/store/EmailOtp";

export const AuthApi = () => {
  const { fetchApi, res, url, pending, method, body } = FetchUtils();
  const router = useRouter();
  const storeOtp = useEmailOtp();

  async function requestOtp(emailData) {
    res.value = [];
    url.value = "request-otp";
    method.value = "POST";

    body.value = {
      email: emailData,
    };

    await fetchApi();

    if (res.value.status == 200) {
      storeOtp.setEmailOtp(email.value);
      router.push("/auth/otp");
    }
  }

  async function login(emailData, passwordData) {
    res.value = [];
    url.value = "login";
    method.value = "POST";

    body.value = {
      email: emailData,
      password: passwordData,
    };

    await fetchApi();

    if (res.value.status === 428) {
      res.value = [];
      requestOtp(emailData);
    }

    if (res.value.status === 200) {
      const data = await res.value.json();
      localStorage.setItem("token", data.data.token);
      router.push("/");
    }
  }

  async function sendOtp(emailData, otpData) {
    res.value = [];
    url.value = "verify-otp";
    method.value = "POST";
    body.value = { email: emailData, otp: otpData };

    await fetchApi();

    if (res.value.status === 200) {
      const data = await res.value.json();
        localStorage.setItem("token", data.data.token);
      router.push("/");
    }
  }

  async function register(emailData, passwordData, usernameData) {
    res.value = [];
    url.value = "register";
    method.value = "POST";

    body.value = {
      email: emailData,
      password: passwordData,
      name: usernameData,
    };

    await fetchApi();

    if (res.value.status == 200) {
      requestOtp(emailData);
    }
  }

  return { res, pending, login, sendOtp, register };
};
