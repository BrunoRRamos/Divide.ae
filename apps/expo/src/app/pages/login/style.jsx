import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    logo: {
        height: 50,
        marginBottom: 80,
        marginRight: 30
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 25,
        paddingLeft: 15,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        marginTop: 10
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 15,
        height: 15,
        borderColor: '#FCECA3',
        borderWidth: 1,
        marginRight: 5,
        marginLeft: 10,
    },
    forgotPassword: {
        color: '#999',
    },
    checkboxText: {
        color: '#999',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
        marginTop: 20
    },
    loginButtonText: {
        fontSize: 18,
        color: '#333',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    socialIcon: {
        width: 40,
        height: 40,
    },
    signUpText: {
        color: '#0000EE',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    orText: {
        fontSize: 16,
        color: '#999',
        marginBottom: 20,
    },
    checkboxSelected: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FCECA3',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        marginBottom: 10,
        paddingRight: 10,
        width: '100%',
        height: 50,
        borderColor: '#ccc',

    },
    inputPassword: {
        flex: 1,
        padding: 10,
    },

});

export default styles;
