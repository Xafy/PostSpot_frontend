import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useForm from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

import './PlaceForm.css'
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = props => {
    const auth = useContext(AuthContext)
    const userId = auth.userId
    const placeId = useParams().placeId
    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    const [loadedPlace, setLoadedPlace] = useState(null);

    const [formState, InputHandler, setFormData] = useForm({
        title:{
            value: '',
            isValid: false
        },
        description:{
            value: '',
            isValid: false
        },
        address:{
            value: '',
            isValid: false
        }
    }
    , false)
    
    useEffect(()=>{
        const fetchPlaceId = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
                setLoadedPlace(responseData.place);
                setFormData({
                    title:{
                        value: responseData.place.title,
                        isValid: true
                    },
                    description:{
                        value: responseData.place.title,
                        isValid: true
                    },
                    address:{
                        value: responseData.place.address,
                        isValid: true
                    }
                }
            , true)
            } catch {}
        }
        fetchPlaceId()
    },[sendRequest, setFormData, placeId])
    
    const navigate = useNavigate();

    const updatePlaceSubmitHandler = async (event) =>{
        event.preventDefault();
        try{
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
            'PATCH',
            JSON.stringify({
                title : formState.inputs.title.value,
                description :formState.inputs.description.value,
                address: formState.inputs.address.value
            }),
            {'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token})
            navigate(`/${userId}/places/`)
        } catch {}
    }

    if(isLoading){
        return(
            <div className="center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!loadedPlace && !error){
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        )
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && loadedPlace && (<form className="place-form" onSubmit={updatePlaceSubmitHandler}>
                <Input
                id='title'
                element='input'
                type='text'
                label='Title'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid title'
                onInput={InputHandler}
                initialValue = {loadedPlace.title}
                initialValid = {formState.inputs.title.isValid}
                />
                <Input
                id='description'
                element='textarea'
                label='Description'
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText='Please enter a valid description'
                onInput={InputHandler}
                initialValue = {loadedPlace.description}
                initialValid = {formState.inputs.description.isValid} 
                />
                <Input
                id='address'
                element='input'
                type='text'
                label='Address'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid address'
                onInput={InputHandler}
                initialValue = {loadedPlace.address}
                initialValid = {formState.inputs.address.isValid}
                />
                <Button type='submit' disabled={!formState.isValid}>UPDATE SPOT</Button>
            </form>
            )}
        </React.Fragment>
        )
}

export default UpdatePlace;