import { GRAPHQL_SERVER } from "./constants.js";

export const graphQLRequest = async (payload, options = {}) => {
  const res = await fetch(`${GRAPHQL_SERVER}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Platform: "portal",
      Authorization:
        options && options.accessToken
          ? options.accessToken
          : `SEZLo6KbH1jzJGY1AwVxC5W1VKv8e34l97p6tfdpXliHvpBFfSPCoUBwAE7Ubfbe`,
      ...options,
    },
    body: JSON.stringify(payload),
  });
  const { data, errors } = await res.json();
  if (errors && errors.length && errors[0].message) {
    return {
      isError: true,
      message: errors[0].message,
    };
  }
  return data;
};
