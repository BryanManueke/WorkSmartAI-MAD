import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';

// Required for mobile auth
WebBrowser.maybeCompleteAuthSession();

// Replace these with your actual IDs from Google Cloud Console
// For Expo Go, you only need the webClientId in many cases, 
// but for standalone apps, you need iOS and Android IDs.
const GOOGLE_CLIENT_IDS = {
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
};

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export const useGoogleAuth = () => {
  const [userInfo, setUserInfo] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    ...GOOGLE_CLIENT_IDS,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserData(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      setError('Gagal menghubungkan ke Google.');
      setLoading(false);
    } else if (response?.type === 'cancel') {
      setLoading(false);
    }
  }, [response]);

  const getUserData = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      setUserInfo(user);
    } catch (e) {
      setError('Gagal mengambil data profil Google.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await promptAsync();
    } catch (e) {
      setError('Terjadi kesalahan saat memulai login.');
      setLoading(false);
    }
  };

  return {
    loginWithGoogle,
    userInfo,
    loading: loading || !request,
    error,
    request
  };
};
