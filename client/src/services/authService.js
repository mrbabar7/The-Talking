const API = import.meta.env.VITE_API_URL || "";

export const postSignup = async (formData) => {
  const responce = await fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: formData.userName,
      email: formData.email,
      contact: formData.contact,
      password: formData.password,
    }),
  });

  const data = await responce.json();

  if (!responce.ok) {
    if (responce.status === 422) {
      return { errors: data.errors };
    }
    return {
      message: data.message || "There is something wrong!",
    };
  }

  return data;
};
export const postLogin = async (formData) => {
  const responce = await fetch(`${API}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
  });

  const data = await responce.json();

  if (!responce.ok) {
    if (responce.status === 422) {
      return {
        err: data.err || "Email or Password is incorrect!",
      };
    }
    return {
      err: data.err || "There is something wrong!",
    };
  }

  return data;
};

export const checkUser = async () => {
  const responce = await fetch(`${API}/check`, {
    credentials: "include",
  });
  const data = await responce.json();
  if (!responce.ok) {
    return {
      message: data.message,
    };
  }
  return data;
};

export const logout = async () => {
  const responce = await fetch(`${API}/logout`, {
    credentials: "include",
  });
  const data = await responce.json();
  if (!responce.ok) {
    return {
      err: data.err,
    };
  }
  return data;
};

export const forgotPassword = async (email) => {
  const responce = await fetch(`${API}/forgot-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await responce.json();
  if (!responce.ok) {
    return {
      err: data.error,
    };
  }
  return data;
};

export const resetPassword = async (password, token) => {
  const responce = await fetch(`${API}/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await responce.json();
  if (!responce.ok) {
    return {
      err: data.error,
    };
  }
  return data;
};
