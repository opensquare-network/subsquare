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
      },
    );

    return result;
  }
}

export default Api;
