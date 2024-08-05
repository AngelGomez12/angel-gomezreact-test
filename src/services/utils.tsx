import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../interfaces/products.interface";

const URL_API = "https://fakestoreapi.com/";

export function useLocalStorageSet<T>(key: string, value: string) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : value;
    } catch (error) {
      console.log(error);
      return value;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useLocalStorageRemove(key: string) {
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return removeValue;
}

export function useLocalStorageGet<T>(key: string, defaultValue: T) {
  const [storedValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  });

  return storedValue;
}

export function generateToken() {
  return uuidv4();
}

export function useAPIServiceGet(url: string) {
  const [data, setData] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async ({ order }: { order?: string } = {}) => {
    setLoading(true);
    axios
      .get(order ? `${URL_API}${url}?sort=${order}` : `${URL_API}${url}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, error, fetchData };
}

export function useAPIServicePost(url: string) {
  const [data, setData] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (data: Product) => {
    setLoading(true);
    axios
      .post(`${URL_API}${url}`, data)
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, error, postData };
}

export function useAPIServiceDelete(url: string) {
  const [data, setData] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteData = async (id: string) => {
    setLoading(true);
    axios
      .delete(`${URL_API}${url}/${id}`)
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, error, deleteData };
}

export function useAPIServicePut(url: string) {
  const [data, setData] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const putData = async (data: Product) => {
    setLoading(true);
    axios
      .put(`${URL_API}${url}/${data.id}`, data)
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, error, putData };
}
