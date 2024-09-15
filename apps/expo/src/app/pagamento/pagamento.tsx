import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from "~/components/ui";


export default function ComprovantePagamento() {
  const [receiptAttached, setReceiptAttached] = useState(false);
  const [fileName, setFileName] = useState('');


  return (
    <View className="flex p-6">
      
      <View className=" flex-row items-center mb-6">
        <TouchableOpacity onPress={() => console.log('Voltar')}>
          <FontAwesome5 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl ml-4">Anexar comprovante</Text>
      </View>

      <Text className=" text-lg mb-6">Como deseja anexar o seu comprovante?</Text>

      <View className="space-y-4">
        
        <TouchableOpacity
         // onPress={handleAttachFile}
          className="border-transparent shadow-2xl mb-3 p-4 flex-row items-center rounded-lg border bg-white"
        >
          <FontAwesome5 name="upload" size={24} color="gray" />
          <Text className=" text-lg ml-4">Inserir arquivo</Text>
        </TouchableOpacity>

        
        <TouchableOpacity
        //  onPress={handleTakePhoto}
          className="border-transparent shadow-2xl mb-3 p-4 flex-row items-center rounded-lg border bg-white"
        >
          <FontAwesome5 name="camera" size={24} color="gray" />
          <Text className="text-lg ml-4">Tirar foto</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        {receiptAttached ? (
          <View className="flex-row items-center">
            <FontAwesome5 name="file-alt" size={24} color="black" />
            <Text className="ml-2 text-lg">Comprovante: {fileName || 'Foto anexada'}</Text>
          </View>
        ) : (
          <View className="flex-row items-center">
            <FontAwesome5 name="file-alt" size={24} color="gray" />
            <Text className="ml-2 text-lg text-gray-500">Nenhum comprovante anexado</Text>
          </View>
        )}
      </View>

      <Button
        //onPress={}
        disabled={!receiptAttached}
        className={`mt-10 p-0 ${receiptAttached ? 'bg-black' : 'bg-gray-300'} rounded-lg items-center`}
      >
        <Text className="text-lg">Finalizar</Text>
      </Button>
    </View>
  );
}