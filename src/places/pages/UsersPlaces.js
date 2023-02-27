import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";


const UsersPlaces = () =>{
    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    const [loadedPlaces, setLoadedPlaces] = useState(null);
    const userId = useParams().userId;

    useEffect(()=>{
        const fetchUsers = async () => {
            try{
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                setLoadedPlaces(responseData.places)
            } catch{setLoadedPlaces([])}
        }
        fetchUsers()
    },[sendRequest, userId])

    const onDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(
            places => places.filter(p => p.id !== deletedPlaceId))
    }

    return(
        <React.Fragment>
            {isLoading && <LoadingSpinner/>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={onDeleteHandler}/>}
        </React.Fragment>
    )
}

export default UsersPlaces;