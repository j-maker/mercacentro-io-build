import React, { useEffect, useState } from 'react';
import { Schema } from './Schema';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import StoreStyle from './StoreLocation.css';
import { StoreLocationProps, useMap } from './useMap';
import { Dropdown, Collapsible } from 'vtex.styleguide';

const MapLocal: any = Map;
const MarkerLocal: any = Marker;
const InfoWindowLocal: any = InfoWindow;
const DropdownLocal: any = Dropdown;

const DropDownList = ({


  countries,
  country,
  departments,
  department,
  cities,
  city,
  stores,
  store,


  onChangeDepartment,
  onChangeCity,
  onChangeCountry,
  onChangeStore,



  countryName,
  departmentName,
  cityName,
  storeName,
  hiddenDepartment,
  hiddenCountry
}: any) => {

  const [others, setOthers] = useState([]);
  const [indexCollapse, setIndexCollapse] = useState<number>(stores.length);
  const onChange = (e: number) => {
    if (e == indexCollapse) return setIndexCollapse(stores.length);
    setIndexCollapse(e);
  }

  useEffect(() => {
    if (store && store?.others) {
      setOthers(store?.others);
    }
  }, [store]);

  return (
    <div className={StoreStyle.storeContainerList}>

      <div>






        <h3 className='title-deparment'>País</h3>
        {!hiddenCountry && !hiddenDepartment && <DropdownLocal
          size="small"
          options={countries}
          value={JSON.stringify(country)}
          onChange={(_: any, v: string) => onChangeCountry(v)}
        />}






        <h3 className='title-deparment'>Departamento</h3>
        {!hiddenDepartment && <DropdownLocal
          size="small"
          options={departments}
          value={JSON.stringify(department)}
          onChange={(_: any, v: string) => onChangeDepartment(v)}
        />}





        <h3 className='title-deparment'>Ciudad</h3>
        <DropdownLocal
          size="small"
          options={cities}
          value={JSON.stringify(city)}
          onChange={(_: any, v: string) => onChangeCity(v)}
        />
      </div>


      {stores?.map((item: any, index: number) => {
        let storeFinal = JSON.parse(item.value)

        return <>
          <div className={StoreStyle.containerStoreFinal}>
            <Collapsible
              header={
                <div onClick={() => onChangeStore(item.value)}>{item.label}
                  <div className={StoreStyle.subtitleStoreFinal}>{storeFinal.address}</div>
                  {indexCollapse ? <div className={StoreStyle.moreStoreFinal}>Más detalles...</div> : <div className={StoreStyle.moreStoreFinal}>Menos detalles...</div>}
                </div>
              }
              align="right"
              onClick={() => onChange(index)}

              isOpen={indexCollapse === index}
              caretColor="muted"
            >


              {store && (
                <div className={StoreStyle.storeMarkStoreContainer}>
                  {store?.image && <div className={StoreStyle.storeMarkStoreImage} style={{ backgroundImage: 'url(' + store?.image + ')' }}></div>}

                  <div className={StoreStyle.storeMarkStoreType}>{store?.type}</div>
                  <div className={StoreStyle.storeTitle}>Dirección</div>
                  <div className='flex'>
                    <div className={StoreStyle.storeMarkStoreAddress}>{store?.address}</div>
                    <div className={StoreStyle.storeMarkStoreAddressWaze}><a className={StoreStyle.storeMarkStoreAddressWazeLink} target='_blank' href={store?.waze}>Abrir en <br></br> Maps</a></div>
                  </div>
                  <div className={StoreStyle.storeTitle}>Teléfono</div>
                  <div className={StoreStyle.storeMarkStorePhone}>{store?.phone}</div>
                  <div className={StoreStyle.storeTitle}>Horarios</div>
                  {store?.schedule && (
                  <div className={StoreStyle.storeMarkStoreSchedule} style={{ whiteSpace: 'pre-line' }}>
                    {store.schedule.replace(/\\n/g, '\n')}
                  </div>
                )}

                  <div className={StoreStyle.storeTitle}>WhatsApp: </div>
                  <div className={StoreStyle.storeMarkStoreConsultant}>{store?.consultant}</div>
                  <div className={StoreStyle.storeMarkStoreEmail}>{store?.email}</div>

                  {others.length ? others.map(other => {
                    return (<div className={StoreStyle.storeMarkStoreOtherContainer}>
                      <div className={StoreStyle.storeMarkStoreOtherTitle}>{other?.__editorItemTitle}</div>
                      <div className={StoreStyle.storeMarkStoreOtherDescription}>{other?.description}</div>
                    </div>)
                  }) : null}
                </div>
              )}

            </Collapsible>
          </div>
        </>
      })}



    </div>
  );
};



const MapLocation = ({ google, store, stores }: any) => {


  const [others, setOthers] = useState([]);
  const [makerState, setMarketState] = useState({
    activeMarker: {},
    selectedPlace: {},
    showingInfoWindow: false
  });

  useEffect(() => {
    if (store && store?.others) {
      setOthers(store?.others);
    }
  }, [store]);

  const onCliCkMarket = (props: any, marker: any) => {
    setMarketState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true
    });
  };

  const onInfoWindowClose = () =>
    setMarketState({
      selectedPlace: null,
      activeMarker: null,
      showingInfoWindow: false
    });

  const onMapClicked = () => {
    if (makerState.showingInfoWindow) onInfoWindowClose();
  };

  return (
    <div className={StoreStyle.storeContainerMap}>
      <MapLocal
        google={google}
        center={{
          lat: store?.lat,
          lng: store?.lng
        }}
        initialCenter={{
          lat: store?.lat,
          lng: store?.lng
        }}
        zoom={17}
        onClick={onMapClicked}
      >
        <MarkerLocal
          name={store?.__editorItemTitle}
          onClick={onCliCkMarket}
          position={{ lat: store?.lat, lng: store?.lng }}
        />

        <InfoWindowLocal
          marker={makerState.activeMarker}
          onClose={onInfoWindowClose}
          visible={makerState.showingInfoWindow}
        >
          <div className={StoreStyle.storeMarkContainer}>
            {store?.image && <div className={StoreStyle.storeMarkStoreImage} style={{ backgroundImage: 'url(' + store?.image + ')' }}></div>}
            <div className={StoreStyle.storeMarkStoreName}>{store?.__editorItemTitle}</div>
            <div className={StoreStyle.storeMarkStoreType}>{store?.type}</div>

            <div className='flex'>
              <div className={StoreStyle.storeMarkStoreAddress}>{store?.address}</div>
              <div className={StoreStyle.storeMarkStoreAddressWaze}>{store?.waze}</div>
            </div>

            {store?.schedule && (
  <div className={StoreStyle.storeMarkStoreSchedule} style={{ whiteSpace: 'pre-line' }}>
    {store.schedule.replace(/\\n/g, '\n')}
  </div>
)}
            <div className={StoreStyle.storeMarkStoreConsultant}>{store?.consultant}</div>
            <div className={StoreStyle.storeMarkStorePhone}>{store?.phone}</div>
            <div className={StoreStyle.storeMarkStoreEmail}>{store?.email}</div>
            {others.length ? others.map(other => {
              return (<>
                <div className={StoreStyle.storeMarkStoreOtherTitle}>{other?.__editorItemTitle}</div>
                <div className={StoreStyle.storeMarkStoreOtherDescription}>{other?.description}</div>
              </>)
            }) : null}
          </div>
        </InfoWindowLocal>
      </MapLocal>
    </div>
  );
};

const WithStoreLocation = (props: StoreLocationProps) => {
  const MapContext = useMap(props);
  const { store, stores } = MapContext;
  return (
    <div className={StoreStyle.storeContainer}>
      <div className={StoreStyle.containerMainStore}>
        <h1>{props.title}</h1>
        <DropDownList {...MapContext} /> </div>
      {store && <MapLocation google={props.google} store={store} stores={stores} />}
    </div>
  );
};

const StoreLocationComponent: any = GoogleApiWrapper(props => {
  return {
    apiKey: props.google
  };
})(WithStoreLocation);

StoreLocationComponent.schema = Schema;
StoreLocationComponent.defaultProps = {
  countryName: "Pais",
  departmentName: "Departamentos:",
  cityName: "Ciudad:",
  storeName: "Tiendas:",
  hiddenDepartment: false,
  hiddenCountry: false
};

export default StoreLocationComponent;
