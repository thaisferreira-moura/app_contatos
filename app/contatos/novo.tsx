import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FormContato from '../../components/FormContato';
import api, { loadAuthToken } from '../../lib/api';
import { global } from '../../styles/global';
import { Contato } from '../../types/Contato';

export default function NovoContato() {
  const router = useRouter();

  const salvar = async (dados: Partial<Contato>) => {
    try {
      await loadAuthToken();
      await api.post('/contatos', dados);
      router.back();
    } catch (err: any) {
      Alert.alert(
        'Erro',
        err?.response?.data?.mensagem ||
          err?.response?.data?.erro ||
          'Falha ao criar contato.'
      );
      throw err;
    }
  };

  return (
    <View style={global.container}>
      <FormContato onSubmit={salvar} />
    </View>
  );
}
