import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const PaymentMethods = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (method: 'Pix' | 'Cartao' | 'Dinheiro') => {
    setSelected(method);
  };

  // const handleNext = () => {
  //   if (selected) {
  //     router.push('/pagamento/Pagamento');
  //   }
  // };

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
