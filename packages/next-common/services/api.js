const paramsKeyConvert = (str = "") =>
  str.replace(/[A-Z]/g, ([s]) => `_${s.toLowerCase()}`);

class Api {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async fetch(path, params = {}, options) {
    const url = new URL(path, this.endpoint);
    for (const key of Object.keys(params)) {
      url.searchParams.set(paramsKeyConvert(key), params[key]);
    }

    let response;
    try {
      response = await fetch(url, options);
    } catch (e) {
      return {
        error: {
          status: 500,
          message: e.message,
        },
      };
    }

    if (response.status === 200) {
      try {
        const result = await response.json();
        return { result };
      } catch (e) {
        return {
          error: {
            status: 500,
            message: e.message,
          },
        };
      }
    }

    let text;
    try {
      text = await response.text();
    } catch (e) {
      return {
        error: {
          status: 500,
          message: e.message,
        },
      };
    }

    try {
      const data = JSON.parse(text);
      return {
        error: {
          status: response.status,
          message: data.message,
          data: data.data,
        },
      };
    } catch {
      return {
        error: {
          status: response.status,
          message: text,
        },
      };
    }
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
