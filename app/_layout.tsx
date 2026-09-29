import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { loadAuthToken } from '../lib/api';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function verificarLogin() {
      const token = await loadAuthToken();
      const isAuthPage = pathname === '/' || pathname === '/cadastro';

      if (active && !token && !isAuthPage) {
        router.replace('/');
      }

      if (active) setLoading(false);
    }

    verificarLogin();

    return () => {
      active = false;
    };
  }, [pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="cadastro" options={{ title: 'Cadastro' }} />
      <Stack.Screen name="contatos/index" options={{ title: 'Contatos' }} />
      <Stack.Screen name="contatos/novo" options={{ title: 'Novo contato' }} />
      <Stack.Screen name="contatos/[id]" options={{ title: 'Editar contato' }} />
    </Stack>
  );
}
