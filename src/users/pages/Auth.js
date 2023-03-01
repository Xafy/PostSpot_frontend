import React, { useContext, useState } from "react";

import useForm from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Card from "../../shared/components/UIElements/Card"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

import './Auth.css'
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = () => {

    const auth = useContext(AuthContext)

    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [formState, inputHandler, setFormData] = useForm(
    {
        email: {
        value: '',
        isValid: false
        },
        password: {
        value: '',
        isValid: false
        }
    },
    false
        );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
        {
            ...formState.inputs,
            name: undefined,
            image: undefined
        },
            formState.inputs.email.isValid && formState.inputs.password.isValid
        );
        }
        else {
        setFormData(
        {
            ...formState.inputs,
            name: {
            value: '',
            isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
            false
        );
    }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/users/login`,
                'POST',
                JSON.stringify({
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
                }),
                {'Content-Type': 'application/json'})
                .then((responseData)=>{auth.login(responseData.userId, responseData.token)})
        } 
        else {
            const formData = new FormData()
            formData.append('username', formState.inputs.name.value)
            formData.append('email', formState.inputs.email.value)
            formData.append('password', formState.inputs.password.value)
            formData.append('image', formState.inputs.image.value)
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/users/register`,
                'POST',
                formData)
                .then((responseData)=>{auth.login(responseData.userId, responseData.token);})
            }
    }


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay/>}
                {isLoginMode ? <h2>Login Required</h2> : <h2>Create a new account</h2>}
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                        element="input"
                        id="name"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a name."
                        onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText = "Please provide an image" />}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid password, at least 5 characters."
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </React.Fragment>
        
    );
};

export default Auth;