import React , {useContext, useState} from "react";

import Map from "../../shared/components/UIElements/Map";
// import MapOl from "../../shared/components/UIElements/Map";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import './PlaceItem.css'
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = props =>{
    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    const auth = useContext(AuthContext);

    const [showMap, setShowMap] = useState(false);
    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);    

    const [showConfirmDeleteModal, setConfirmDeleteModal] = useState(false) 
    const showDeleteHandler = () => setConfirmDeleteModal(true)
    const hideDeleteHandler = () => setConfirmDeleteModal(false)

    const confirmDeleteHandler = async () =>{
        setConfirmDeleteModal(false)
        try {
            await sendRequest(`http://localhost:5000/api/places/${props.id}`,
            'DELETE',
            null,
            {Authorization: 'Bearer ' + auth.token});
            props.onDelete(props.id)
        } catch {}
        
    }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
            show ={showMap}
            onCancel={closeMapHandler}
            header ={props.address}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={<Button onClick={closeMapHandler}>Close</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>

            <Modal 
            show={showConfirmDeleteModal}
            header = 'Are you sure?'
            footerClass= 'place-item__modal-actions'
            footer={
                <React.Fragment>
                    <Button inverse onClick={hideDeleteHandler}>Cancel</Button>
                    <Button danger onClick={confirmDeleteHandler}>Delete</Button>
                </React.Fragment>
            }>
                This action can't be undone, do you want to proceed?
            </Modal>
            
        <li className="place-item">
            <Card className="place-item-content">
                {isLoading && <LoadingSpinner asOverlay/>}
                <div className="place-item__image">
                    <img src={`http://localhost:5000/${props.image}`} alt={props.title}/>
                </div>
                <div className="place-item__info">
                    <h2>{props.title}</h2>
                    <h3>{props.address}</h3>
                    <p>{props.description}</p>
                </div>
                <div className="place-item__actions">
                    <Button inverse onClick={openMapHandler}>View on map</Button>
                    {auth.userId === props.creatorId && 
                    <>
                    <Button to={`/places/${props.id}`}>Edit</Button>
                    <Button danger onClick={showDeleteHandler}>Delete</Button>
                    </>                    
                    }

                </div>
            </Card>
        </li>
        </React.Fragment>
        
        
    )
}

export default PlaceItem;