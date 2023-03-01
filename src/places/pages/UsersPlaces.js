import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";


const UsersPlaces = () =>{
    const {isLoading, sendRequest} = useHttpClient()
    const [loadedPlaces, setLoadedPlaces] = useState(null);
    const userId = useParams().userId;

    useEffect(()=>{
        const fetchUsers = async () => {
            try{
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
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