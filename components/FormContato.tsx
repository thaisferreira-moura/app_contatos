import { useState } from 'react';
import { View, TextInput, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api, { getImageUrl } from '../lib/api';
import { global } from '../styles/global';
import { Contato } from '../types/Contato';

interface Props {
  valores?: Partial<Contato>;
  onSubmit: (dados: Partial<Contato>) => void | Promise<void>;
}

export default function FormContato({ valores, onSubmit }: Props) {
  const [nome, setNome] = useState(valores?.nome || '');
  const [email, setEmail] = useState(valores?.email || '');
  const [telefone, setTelefone] = useState(valores?.telefone || '');
  const [endereco, setEndereco] = useState(valores?.endereco || '');
  const [fotoId, setFotoId] = useState<string | undefined>(valores?.fotoId);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const escolherImagem = async () => {
    const permissoes = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissoes.status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso à galeria para escolher uma imagem.'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (resultado.canceled || resultado.assets.length === 0) return;

    const file = resultado.assets[0];
    const form = new FormData();

    form.append(
      'foto',
      {
        uri: file.uri,
        name: file.fileName || 'imagem.jpg',
        type: file.mimeType || 'image/jpeg',
      } as any
    );

    try {
      setEnviandoFoto(true);

      const { data } = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!data?.fileId) {
        throw new Error('A API não retornou fileId.');
      }

      setFotoId(data.fileId);
    } catch (err: any) {
      Alert.alert(
        'Erro no upload',
        err?.response?.data?.erro ||
          err?.message ||
          'Não foi possível enviar a imagem.'
      );
    } finally {
      setEnviandoFoto(false);
    }
  };

  const enviar = async () => {
    if (!nome.trim()) {
      Alert.alert('Validação', 'Nome é obrigatório.');
      return;
    }

    try {
      setSalvando(true);
      await onSubmit({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        fotoId,
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View>
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
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        style={global.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        style={global.input}
      />

      <Button
        title={enviandoFoto ? 'Enviando imagem...' : 'Selecionar imagem'}
        onPress={escolherImagem}
        disabled={enviandoFoto}
      />

      {fotoId ? (
        <Image
          source={{ uri: getImageUrl(fotoId) }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 10,
            marginVertical: 12,
          }}
        />
      ) : null}

      <Button
        title={salvando ? 'Salvando...' : 'Salvar'}
        onPress={enviar}
        disabled={salvando || enviandoFoto}
      />
    </View>
  );
}
