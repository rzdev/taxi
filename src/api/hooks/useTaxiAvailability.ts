import {useQuery} from 'react-query';
import {API} from '../helpers';
import {IGetTaxiAvailabilityParams, IGetTaxiAvailabilityResponse} from './../types';
import {ILocationData} from '../../types';
import {AxiosError} from 'axios';
import {format} from 'date-fns'
import {calcTimezone} from '../../utils/helpers';

const getTaxiAvailability = async (params: IGetTaxiAvailabilityParams) => {
  const {request} = API();

  //set the date to singaporean timezone
  let singaporeDate = calcTimezone(params.date_time);
  const locationData: ILocationData[] = [];

  //get the range of data for every 10 minutes in 1 hour
  for(let i=0;i<=10;i++){
    const {data}: {data:IGetTaxiAvailabilityResponse} = await request.get('transport/taxi-availability',{params: {date_time: format(singaporeDate,"yyyy-MM-dd'T'HH:mm:ss")}});
    data.features[0].geometry.coordinates.map((j) => 
      locationData.push(
        {
          taxiNo: '-',
          timestamp: Math.floor(singaporeDate.getTime() / 1000), // parse date to unix timestamp
          coordinate: j
        }
      )
    );
      
    singaporeDate.setMinutes(singaporeDate.getMinutes() + 6);
  }

  return locationData;
};

export default function useTaxiAvailability(params: IGetTaxiAvailabilityParams) {
  return useQuery<ILocationData[], AxiosError<Error>>(['taxiAvailability', params], () => getTaxiAvailability(params));
}
