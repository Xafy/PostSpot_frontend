import React, { useContext } from "react";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import useForm from "../../shared/hooks/form-hook";
import './PlaceForm.css'
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () =>{
    const auth = useContext(AuthContext)
    const {isLoading, error, sendRequest, clearError} = useHttpClient()

    const [formState, InputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address:{
            value: '',
            isValid: false
        }}
        ,false)

    const navigate = useNavigate();


    const newPlaceSubmitHandler = async event => {
        event.preventDefault();
        try { 
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value)
            formData.append('image', formState.inputs.image.value)
            formData.append('description', formState.inputs.description.value)
            formData.append('address', formState.inputs.address.value)
            formData.append('creator', auth.userId)
            await sendRequest('http://localhost:5000/api/places',
            'POST',
            formData,)
            navigate('/')
        } catch{}
    }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className="place-form" onSubmit={newPlaceSubmitHandler}>
                {isLoading && <LoadingSpinner asOverly/>}
                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid text!'
                    onInput={InputHandler}>
                </Input>
                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please enter a valid description (at least 5 characters).'
                    onInput={InputHandler}>
                </Input>
                <Input
                    id='address'
                    element='input'
                    label='Adress'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid adress .'
                    onInput={InputHandler}>
                </Input>
                <ImageUpload center id="image" onInput={InputHandler} errorText="Please provide an image"/>
                <Button type="submit" disabled={!formState.isValid}>POST SPOT</Button>
            </form>
        </React.Fragment>
    )
}

export default NewPlace;