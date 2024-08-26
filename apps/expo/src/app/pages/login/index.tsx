import { useSignIn } from '@clerk/clerk-expo';
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './style.jsx';

export default function Page({ navigation }: { navigation: NavigationProp<any> }) {
    const { signIn, setActive, isLoaded } = useSignIn()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) {
            return
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                navigation.navigate('Segunda Tela')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, emailAddress, password])

    return (
        <View style={styles.container}>
            <Image
                source={require('./images/Logo.png')}
                style={styles.logo} // Aplica o estilo logo
            />
            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email"
                style={styles.input}
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <TextInput
                value={password}
                placeholder="Senha"
                secureTextEntry={true}
                style={styles.input}
                onChangeText={(password) => setPassword(password)}
            />
            <View style={styles.optionsContainer}>
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity style={styles.checkbox} />
                    <Text style={styles.checkboxText}>Salvar usuário</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={styles.loginButton} onPress={onSignInPress}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>ou</Text>
            <View style={styles.socialContainer}>
                <TouchableOpacity>
                    <Image
                        source={require('./images/Logo.png')} // Icone do Facebook
                        style={styles.socialIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('./images/Logo.png')} // Icone do Google
                        style={styles.socialIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('./images/Logo.png')} // Icone do Twitter/X
                        style={styles.socialIcon}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Segunda Tela')}>
                <Text style={styles.signUpText}>Registre-se</Text>
            </TouchableOpacity>
        </View>
    );
};

