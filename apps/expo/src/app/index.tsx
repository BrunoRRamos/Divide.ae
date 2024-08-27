import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { default as TelaCadastro } from './pages/cadastro/telaCadastro';
import Feed from './pages/feed/feed';
import Page from './pages/login';

const Stack = createNativeStackNavigator();

const publishableKey = "pk_test_aG9seS1maWxseS0yNC5jbGVyay5hY2NvdW50cy5kZXYk"

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}


export default function Index() {
  return (

    <ClerkProvider publishableKey={publishableKey}>
      <ClerkLoaded>
        <Stack.Navigator>
          <Stack.Screen
            name="Page"
            component={Page}
          />
          <Stack.Screen
            name="Tela de cadastro"
            component={TelaCadastro}
            options={{ title: 'Tela de cadastro' }}
          />
          <Stack.Screen
            name="Feed"
            component={Feed}
            options={{ title: 'Feed' }}
          />
        </Stack.Navigator>
      </ClerkLoaded>
    </ClerkProvider>

  );
}
