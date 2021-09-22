// https://react-native-async-storage.github.io/async-storage/docs/api

import AsyncStorage from '@react-native-async-storage/async-storage';

interface IStoreData {
  storageKey: string;
  data: {
    [key: string]: string;
  };
}

const storeData = async ({ storageKey, data }: IStoreData): Promise<void | string> => {
  const json = JSON.stringify(data);
  try {
    await AsyncStorage.setItem(storageKey, json);
  } catch (e) {
    return `An error has occured: ${e}`;
  }
};

type IStorageKey = Omit<IStoreData, 'data'>;

const getData = async ({ storageKey }: IStorageKey): Promise<void | string> => {
  try {
    const json = await AsyncStorage.getItem(storageKey);
    return json !== null ? JSON.parse(json) : null;
  } catch (e) {
    return `An error has occured: ${e}`;
  }
};

const removeValue = async ({ storageKey }: IStorageKey): Promise<void | string> => {
  try {
    await AsyncStorage.removeItem(storageKey);
  } catch (e) {
    return `An error has occured: ${e}`;
  }
};

export { storeData, getData, removeValue };
