import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '~/lib/supabase';


const PaymentMethods = () => {
 
    const [selected, setSelected] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
  
    const handleSelect = (method: 'Pix' | 'Cartao' | 'Dinheiro') => {
      setSelected(method);
    };
  
    const pickImage = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Desculpe, precisamos de permissão para acessar a galeria!');
          return;
        }
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset?.uri) {
          uploadImage(asset.uri);
        } else {
          Alert.alert('Erro', 'Não foi possível obter a URI da imagem.');
        }
      } else {
        Alert.alert('Nenhuma imagem selecionada');
      }
    
    };
  
    const uploadImage = async (uri: string) => {
      try {
        setUploading(true);
        const response = await fetch(uri);
        const blob = await response.blob();
  
        const fileExt = uri.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `public/${fileName}`;
       
        let { error: uploadError } = await supabase.storage
          .from('avatars') 
          
          .upload(filePath, blob);
  
        if (uploadError) {
          throw uploadError;
        }
  
        Alert.alert('Upload feito com sucesso!');
      } catch (error) {
        Alert.alert('Erro ao fazer upload da imagem: ' + error);
      } finally {
        setUploading(false);
      }
    };
  
  return (
    <View className="flex-3 p-6 ">
      <Text className="text-xl mb-6">Qual será a forma de pagamento?</Text>
      <View className="space-y-4">
      <TouchableOpacity
          onPress={() => handleSelect('Pix')}
          className={`border-transparent shadow-2xl mb-3 p-4 flex-row items-center rounded-lg border ${
            selected === 'Pix' ? 'bg-gray-200' : 'bg-white'
          }`}
        >
           <FontAwesome5 name="qrcode" size={24} color={selected === 'Pix' ? '#00bfa5' : 'gray'} />
          <Text className="text-lg">  Pix</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelect('Cartao')}
          className={`border-transparent shadow-2xl mb-3 p-4 flex-row items-center rounded-lg border ${
            selected === 'Cartao' ? 'bg-gray-200' : 'bg-white'
          }`}
        >
           <FontAwesome5 name="credit-card" size={24} color={selected === 'Cartao' ? 'black' : 'gray'} />
          <Text className="text-lg">  Cartão</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelect('Dinheiro')}
          className={`border-transparent shadow-2xl p-4 flex-row items-center rounded-lg border ${
            selected === 'Dinheiro' ? 'bg-gray-200' : 'bg-white'
          }`}
        >
           <FontAwesome5 name="dollar-sign" size={24} color={selected === 'Dinheiro' ? '#00bfa5' : 'gray'} />
          <Text className="text-lg">  Dinheiro</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        // onPress={}
        className="mt-10 p-4 bg-gray-300 rounded-lg items-center"
        disabled={!selected}
      >
        <Text className="text-lg">Avançar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentMethods;
