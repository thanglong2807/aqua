// src/lib/api.ts

import qs from 'qs';

export const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
  return `${STRAPI_API_URL}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {object} urlParamsObject URL params object, will be stringified
 * @param {object} options Options passed to fetch
 * @returns {Promise} Parsed API call response
 */
export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  try {
    // Merge default and user options
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject, {
      encodeValuesOnly: true, // prettify URL
    });
    const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`)}`;


    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
      console.error("Fetch API Error:", response.status, response.statusText);
      const errorBody = await response.text();
      console.error("Error Body:", errorBody);
      return { data: [] };
    }
    const data = await response.json();

    // The API returns data in a 'data' property.
    // We are returning it directly as it has a flat structure.
    return data;
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}

/**
 * 
 * @param {object} media The media object from Strapi
 * @returns {string} The URL of the media
 */
export function getStrapiMedia(media: any): string | null {
    if (!media) {
        return null;
    }

  const mediaItem = Array.isArray(media)
    ? media[0]
    : Array.isArray(media?.data)
      ? media.data[0]
      : media?.data || media;

  const url = mediaItem?.url || mediaItem?.attributes?.url;

    if (!url) {
        return null;
    }

    // Prepend the Strapi URL to the relative path
    return url.startsWith("/") ? getStrapiURL(url) : url;
}

  export function formatPrice(price: string | number | null | undefined, fallback = 'Liên hệ'): string {
    if (price === null || price === undefined || price === '') {
      return fallback;
    }

    const numericPrice = typeof price === 'number'
      ? price
      : Number(String(price).replace(/[^\d.-]/g, ''));

    if (Number.isNaN(numericPrice)) {
      return String(price);
    }

    return `${new Intl.NumberFormat('vi-VN').format(numericPrice)} đ`;
  }

/**
 * Helper to handle both flat and nested structures
 * @param {object} data The data object to flatten
 * @returns {object} The flattened object
 */
export function flattenAttributes(data: any): any {
    if (!data) return null;

    // If data is an array, map over it
    if (Array.isArray(data)) {
        return data.map(flattenAttributes);
    }

    // If data is an object, check for 'attributes'
    let attributes: Record<string, any> = {};
    if (data.attributes) {
        attributes = { ...data.attributes };
    } else {
        // If no 'attributes', use the object itself, excluding id
        const { id, ...rest } = data;
        attributes = rest;
    }

    // Recursively flatten any nested 'data' objects
    for (const key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key) && attributes[key]?.data) {
            attributes[key] = flattenAttributes(attributes[key].data);
        }
    }

    return {
        id: data.id,
        ...attributes,
    };
}
