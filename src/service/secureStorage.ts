import { Preferences } from '@capacitor/preferences';

export const saveUserSession = async (token: string, role: string) => {
  console.log('🔐 Guardando token JWT en secureStorage:', token);
  await Preferences.set({ key: 'authToken', value: token });
  await Preferences.set({ key: 'userRole', value: role });

  // Decodificar el token manualmente para sacar el userId
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userId = payload.sub; // 👈 extraemos el userId

  console.log('🧩 userId extraído del JWT:', userId);
  await Preferences.set({ key: 'userId', value: userId.toString() });
};

export const getUserSession = async () => {
  const { value } = await Preferences.get({ key: 'authToken' });
  console.log("📦 Token obtenido desde secureStorage:", value);
  return value;
};

export const getUserRole = async () => {
  const { value } = await Preferences.get({ key: 'userRole' });
  console.log("👤 Rol obtenido desde secureStorage:", value);
  return value;
};

export const clearUserSession = async () => {
  await Preferences.remove({ key: 'authToken' });
  await Preferences.remove({ key: 'userRole' });
  await Preferences.remove({ key: 'userId' });
};

export const getUserId = async (): Promise<number> => {
  const { value } = await Preferences.get({ key: 'userId' });
  return parseInt(value || '0');
};
export const getToken = async (): Promise<string> => {
  const { value } = await Preferences.get({ key: 'authToken' });
  return value || '';
};