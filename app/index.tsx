import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api, { setAuthToken } from '../lib/api';
import { global } from '../styles/global';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const entrar = async () => {
    if (!email.trim() || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha.');
      return;
    }

    try {
      setCarregando(true);
      const { data } = await api.post('/usuarios/login', {
        email: email.trim(),
        senha,
      });

      if (!data?.token) throw new Error('Token não retornado pela API.');

      await setAuthToken(data.token);
      router.replace('/contatos');
    } catch (err: any) {
      const msg =
        err?.response?.data?.mensagem ||
        err?.response?.data?.erro ||
        err?.message ||
        'Falha ao autenticar.';
      Alert.alert('Erro ao entrar', msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={global.container}>
      <Text style={global.title}>App Contatos</Text>
      <Text style={global.subtitle}>Entre para acessar seus contatos.</Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={global.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={global.input}
      />

      <Button title={carregando ? 'Entrando...' : 'Entrar'} onPress={entrar} disabled={carregando} />
      <View style={{ height: 10 }} />
      <Button title="Cadastrar" onPress={() => router.push('/cadastro')} />
    </View>
  );
}
