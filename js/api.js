async function apiGet(params = {}) {

  const query =
    new URLSearchParams(params);

  const response =
    await fetch(
      `${API_URL}?${query}`
    );

  return await response.json();

}

async function apiPost(data) {

  const formData = new FormData();

  formData.append(
    'payload',
    JSON.stringify(data)
  );

  const response =
    await fetch(API_URL, {

      method: 'POST',

      body: formData

    });

  return await response.json();

}
