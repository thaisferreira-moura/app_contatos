import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  Alert,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import api, { clearAuthToken, getImageUrl, loadAuthToken } from '../../lib/api';
import { global } from '../../styles/global';
import { Contato } from '../../types/Contato';

export default function ListaContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [atualizando, setAtualizando] = useState(false);
  const router = useRouter();

  const carregar = useCallback(async () => {
    try {
      const token = await loadAuthToken();
      if (!token) {
        router.replace('/');
        return;
      }

      const { data } = await api.get('/contatos');
      setContatos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        await clearAuthToken();
        router.replace('/');
        return;
      }

      Alert.alert('Erro', 'Falha ao carregar contatos. Verifique a API.');
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const excluir = (id: string) => {
    Alert.alert('Excluir contato', 'Deseja realmente excluir este contato?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/contatos/${id}`);
            await carregar();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  };

  const sair = async () => {
    await clearAuthToken();
    router.replace('/');
  };

  return (
    <View style={global.container}>
      <Text style={global.title}>Seus contatos</Text>

      <Button title="Novo contato" onPress={() => router.push('/contatos/novo')} />
      <View style={{ height: 8 }} />
      <Button title="Sair" onPress={sair} />

      <FlatList
        style={{ marginTop: 12 }}
        data={contatos}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={async () => {
              setAtualizando(true);
              await carregar();
              setAtualizando(false);
            }}
          />
        }
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>
            Nenhum contato cadastrado.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={global.card}
            onPress={() => router.push(`/contatos/${item._id}`)}
          >
            {item.fotoId ? (
              <Image
                source={{ uri: getImageUrl(item.fotoId) }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  marginBottom: 8,
                }}
              />
            ) : null}

            <Text style={global.cardTitle}>{item.nome}</Text>
            {!!item.telefone && <Text>{item.telefone}</Text>}
            {!!item.email && <Text>{item.email}</Text>}

            <View style={{ height: 8 }} />
            <Button title="Excluir" onPress={() => excluir(item._id)} />
          </Pressable>
        )}
      />
    </View>
  );
}
