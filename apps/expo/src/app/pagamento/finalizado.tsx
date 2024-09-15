import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '~/components/ui';


export default function PaymentSuccessScreen() {
//   const handleFinish = () => {
//    
//     navigation.navigate('Home');
//   };

  return (
    <View className={`flex justify-center items-center bg-white`}>
      <View className={`mb-6`}>
      <FontAwesome5  name="check-circle" size={100} color="green" />
      </View>
      <Text className={`text-xl font-bold text-black mb-10`}>
        Pagamento realizado com sucesso!
      </Text>
      <Button
        //onPress={}
       // disabled={!receiptAttached}
        className={`mt-10 p-0 rounded-lg items-center`}
      >
        <Text className="text-lg">Finalizar</Text>
      </Button>
    </View>
  );
}