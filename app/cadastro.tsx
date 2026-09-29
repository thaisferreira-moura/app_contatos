import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../lib/api';
import { global } from '../styles/global';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const registrar = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, e-mail e senha.');
      return;
    }

    try {
      setCarregando(true);
      await api.post('/usuarios/registrar', {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      Alert.alert('Sucesso', 'Usuário cadastrado! Agora faça login.');
      router.replace('/');
    } catch (err: any) {
      const msg =
        err?.response?.data?.mensagem ||
        err?.response?.data?.erro ||
        'Não foi possível cadastrar.';
      Alert.alert('Erro ao cadastrar', msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={global.container}>
      <Text style={global.title}>Criar conta</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={global.input}
      />

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

      <Button
        title={carregando ? 'Cadastrando...' : 'Registrar'}
        onPress={registrar}
        disabled={carregando}
      />
    </View>
  );
}
