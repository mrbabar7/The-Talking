const API = import.meta.env.VITE_API_URL || "";

export const contactList = async () => {
  const responce = await fetch(`${API}/api/contacts`, {
    credentials: "include",
  });

  const data = await responce.json();
  if (!responce.ok) {
    return {
      err: data.err || "there is something wrong!",
    };
  }
  return data;
};

export const chatContact = async (chatMessage) => {
  const formData = new FormData();
  formData.append("contactId", chatMessage.contactId);
  formData.append("clientTempId", chatMessage.clientTempId);
  formData.append("text", chatMessage.text);
  if (chatMessage.images?.length) {
    chatMessage.images.forEach((image) => {
      formData.append("images", image);
    });
  }
  const responce = await fetch(`${API}/api/chat-contact`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await responce.json();
  if (!responce.ok) {
    return {
      error: data.error || "there is something wrong!",
    };
  }
  return data;
};

export const voiceMessage = async (voiceChat) => {
  const formData = new FormData();
  formData.append("contactId", voiceChat.contactId);
  formData.append("clientTempId", voiceChat.clientTempId);
  formData.append("audio", voiceChat.audioBlob);
  const responce = await fetch(`${API}/api/voice-message`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await responce.json();
  if (!responce.ok) {
    return {
      err: data.err || "there is something wrong!",
    };
  }
  return data;
};

export const getChatMessages = async (contactId) => {
  const responce = await fetch(`${API}/api/chat-contact/${contactId}`, {
    credentials: "include",
  });

  const data = await responce.json();
  if (!responce.ok) {
    return {
      err: data.err || "there is something wrong!",
    };
  }
  return data;
};

export const getConversations = async () => {
  const responce = await fetch(`${API}/api/conversations`, {
    credentials: "include",
  });

  const data = await responce.json();
  if (!responce.ok) {
    return {
      err: data.err || "there is something wrong!",
    };
  }
  return data;
};
