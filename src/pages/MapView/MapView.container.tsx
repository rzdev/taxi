import React, {useEffect, useState} from 'react';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {DataFilterExtension} from '@deck.gl/extensions';
import {StaticMap} from 'react-map-gl';
import useTaxiAvailability from '../../api/hooks/useTaxiAvailability';
import {ILocationData} from '../../types';
import DateInput from '../../components/DateInput/DateInput.component';
import {fromUnixTime, format} from 'date-fns';

// mapbox token
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoicnpkZXYiLCJhIjoiY2trdzE3eTFlMjB5ZzJ2bXJiMHJjczF5aCJ9.zwddG5bxQmLVBavhkcZAUg";

// SG Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 103.8141629,
  latitude: 1.3143394,
  zoom: 10.5,
  pitch: 0,
  bearing: 0
};

//data filter extension params
const dataFilter = new DataFilterExtension({
  filterSize: 1,
  fp64: false
});

//custom map style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

function MapView() {
  //set default date to yesterday
  const defaultDate = new Date();
  defaultDate.setDate(new Date().getDate()-1)

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const {data: taxiApiData, status: taxiApiStatus} = useTaxiAvailability({date_time: selectedDate});
  const [taxiPosData, setTaxiPosData] = useState<ILocationData[]>([]);
  const [filterRange, setFilterRange] = useState<number[] | number | null>(null);

  //on receive data from API, pass the data to taxiPosData state.
  useEffect(()=>{
    if(taxiApiStatus === 'success' && taxiApiData){
      setTaxiPosData(taxiApiData);
      setFilterRange([taxiApiData[0].timestamp, taxiApiData[taxiApiData.length - 1].timestamp]);
    }
  }, [taxiApiData, taxiApiStatus]);

  const scatterPlot = new ScatterplotLayer<ILocationData>({
    id: 'scatterplot-layer',
    data: taxiPosData,
    pickable: true,
    opacity: 0.8,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: d => d.coordinate,
    getRadius: d => 2,
    getFillColor: d => [255, 140, 0],
    //@ts-ignore
    getFilterValue: d => d.timestamp,
    filterRange: filterRange === null ? [0, 0] : filterRange,
    filterSoftRange: filterRange !== null && [
      //@ts-ignore
      filterRange[0] * 0.9 + filterRange[1] * 0.1,
      //@ts-ignore
      filterRange[0] * 0.1 + filterRange[1] * 0.9
    ],
    extensions: [dataFilter],
  });

  const handleDateChange = (date: Date | null) => {
    if(date !== null){
      setSelectedDate(date);
    }
  };

  const formatLabel = (t: number) => {
    return format(fromUnixTime(t), "HH:mm");
  }

  return (
    <>
      <DeckGL
        layers={[scatterPlot]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        //need to ignore TS here because the custom properties is not typed yet.
        //@ts-ignore
        getTooltip={({object}) => object && {text: `Taxi No: ${object.taxiNo}\nCoordinate: ${object.coordinate[0]},${object.coordinate[1]}\n`}}
      >
        <StaticMap mapStyle={MAP_STYLE} preventStyleDiffing={true} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
      <DateInput 
        min={taxiApiData && taxiApiData.length > 0 ? taxiApiData[0].timestamp : null}
        max={taxiApiData && taxiApiData.length > 0 ? taxiApiData[taxiApiData.length - 1].timestamp : null}
        value={Array.isArray(filterRange) && filterRange.length > 0 ? filterRange : [0,0]}
        animationSpeed={30}
        formatLabel={formatLabel}
        onChange={setFilterRange}
        selectedDate={selectedDate} 
        handleDateChange={handleDateChange} />
    </>
  );
}

export default MapView;
