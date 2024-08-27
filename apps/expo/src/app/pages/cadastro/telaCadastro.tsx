import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Button, Image, TextInput, View } from 'react-native';
import styles from '../login/style.jsx';


const TelaCadastro = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);


    const validatePassword = (password: string): string | null => {
        const minLength = 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasNoMoreThanTwoConsecutive = !/(.)\1\1/.test(password);

        if (password.length < minLength) {
            return 'A senha deve ter pelo menos 8 caracteres.';
        }
        if (!hasUpper) {
            return 'A senha deve conter pelo menos uma letra maiúscula.';
        }
        if (!hasLower) {
            return 'A senha deve conter pelo menos uma letra minúscula.';
        }
        if (!hasDigit) {
            return 'A senha deve conter pelo menos um número.';
        }
        if (!hasNoMoreThanTwoConsecutive) {
            return 'A senha não deve conter mais de 2 caracteres consecutivos iguais.';
        }
        return null;
    };

    const handleRegister = (): void => {
        const passwordError = validatePassword(password);
        if (passwordError) {
            Alert.alert('Erro', passwordError);
        } else if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
        } else {
            Alert.alert('Sucesso', 'Registro feito com sucesso!');
            // navigation.navigate('Feed');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../images/Logo.png')}
                style={styles.logo} // Aplica o estilo logo
            />

            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Senha"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                />

            </View>
            <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                secureTextEntry={!isPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <Button title="Registrar" onPress={handleRegister} color="#d3d3d3" />
        </View>
    );
};


export default TelaCadastro;
