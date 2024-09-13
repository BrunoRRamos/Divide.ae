import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';

const PaymentMethods = () => {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'pix', name: 'Pix', icon: 'payments', label: 'Pix' },
    { id: 'card', name: 'Cartão', icon: 'credit-card', label: 'Cartão' },
    { id: 'cash', name: 'Dinheiro', icon: 'attach-money', label: 'Dinheiro' },
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <TouchableOpacity className="absolute top-4 left-4">
        <MaterialIcons name="arrow-back" size={24} />
      </TouchableOpacity>

      <Text className="text-center text-xl font-bold mb-2">
        Métodos de pagamento
      </Text>
      <Text className="text-center text-lg mb-4">
        Qual será a forma de pagamento?
      </Text>

      <View className="mt-5">
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            className={
              'flex-row items-center p-4 border rounded-lg mb-3'
            }
            onPress={() => setSelectedMethod(method.id)}
          >
            <MaterialIcons className={method.icon} size={24} />
            <Text className="ml-3 text-lg">{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Avançar"
        onPress={() => console.log(`Selected method: ${selectedMethod}`)}
        disabled={!selectedMethod}
      />
    </View>
  );
};

export default PaymentMethods;
