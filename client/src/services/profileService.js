const API = import.meta.env.VITE_API_URL || "";

export const addProfile = async () => {
  const responce = await fetch(`${API}/api/profile/add`, {
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

export const updateProfile = async (profile) => {
  const formData = new FormData();
  formData.append("userName", profile.userName);
  formData.append("contact", profile.contact);
  formData.append("about", profile.about);

  if (profile.image) {
    formData.append("image", profile.image);
  }

  const responce = await fetch(`${API}/api/profile/edit`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const data = await responce.json();
  if (!responce.ok) {
    return {
      error: data.message,
    };
  }
  return data;
};
