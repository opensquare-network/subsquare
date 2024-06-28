const paramsKeyConvert = (str = "") =>
  str.replace(/[A-Z]/g, ([s]) => `_${s.toLowerCase()}`);

class Api {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  fetch(path, params = {}, options) {
    const url = new URL(path, this.endpoint);
    for (const key of Object.keys(params)) {
      url.searchParams.set(paramsKeyConvert(key), params[key]);
    }

    return new Promise((resolve) =>
      fetch(url, options)
        .then((resp) =>
          resp.status !== 200
            ? resp.json().then((data) =>
                resolve({
                  error: {
                    status: resp.status,
                    message: data.message,
                    data: data.data,
                  },
                }),
              )
            : resp.json().then((result) => resolve({ result })),
        )
        .catch((e) =>
          resolve({
            error: {
              status: 500,
              message: e.message,
            },
          }),
        ),
    );
  }

  async post(path, body = null, options = null) {
    const result = await this.fetch(
      path,
      {},
      {
        method: "POST",
        credentials: "same-origin",
        body: body ? JSON.stringify(body) : null,
        headers: { "Content-Type": "application/json" },
        ...options,
      },
    );
    return result;
  }

  async put(path, body = null, options = null) {
    const result = await this.fetch(
      path,
      {},
      {
        method: "PUT",
        credentials: "same-origin",
        body: body ? JSON.stringify(body) : null,
        headers: { "Content-Type": "application/json" },
        ...(options ?? {}),
      },
    );
    return result;
  }

  async patch(path, body = null) {
    const result = await this.fetch(
      path,
      {},
      {
        method: "PATCH",
        credentials: "same-origin",
        body: body ? JSON.stringify(body) : null,
        headers: { "Content-Type": "application/json" },
      },
    );
    return result;
  }

  async delete(path) {
    const result = await this.fetch(
      path,
      {},
      {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      },
    );
    return result;
  }

  async postFormData(path, formData) {
    const result = await this.fetch(
      path,
      {},
      {
        method: "POST",
        credentials: "same-origin",
        body: formData,
        redirect: "follow",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjhlMjQ2ZDQ2ZTU4MGJlNDIzYjI2NiIsImVtYWlsIjoiamllaGFvQG9wZW5zcXVhcmUubmV0d29yayIsInVzZXJuYW1lIjoicG9sa2Fkb3Qta2V5LTB4N2MwNTQxYzA3YTQ2YTExNjkzMjM3MDU0Y2Y3MzFkYmE4MmFiNmYzOGY5OGIyZDgyYzExNTQ1ODFmMjRjZmQyNCIsImlhdCI6MTY5MTM5OTM1NSwiZXhwIjoxNjkyMDA0MTU1fQ.N-798vkm2C0Ot12jxhOVK6H4yMLT5LnUQ4YXYgfanI4",
        },
      },
    );

    return result;
  }
}

export default Api;
