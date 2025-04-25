import { Preferences } from '@capacitor/preferences';

export const saveUserSession = async (token: string) => {
  console.log('🔐 Guardando token JWT en secureStorage:', token);
  await Preferences.set({ key: 'authToken', value: token });
};

export const getUserSession = async () => {
  const { value } = await Preferences.get({ key: 'authToken' });
  console.log("📦 Token obtenido desde secureStorage:", value);
  return value;
};

export const clearUserSession = async () => {
  await Preferences.remove({ key: 'authToken' });
};
