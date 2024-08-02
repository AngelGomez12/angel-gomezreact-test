import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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

export function useAPIService<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    axios
      .get(`${URL_API}${url}`)
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
