type FormInfo = {
    username?: string;
    email: string;
    password: string;
    repeatPassword?: string;
};

type FormErrors = {
    error: boolean;
    msg?: string;
}

type CustomButtonProps = {
    text: string;
    onPress?: () => void;
}