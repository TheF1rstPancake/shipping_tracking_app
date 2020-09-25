import {
  globalConfig
} from "@airtable/blocks";
//import shippo from 'shippo';
import axios from 'axios'
import bearer from "@bearer/js";
const bearerClient = bearer(
  "pk_development_dcdd7838b4eeec0116256798bd5e4a01985060bbbf1c26135a"
);

const API_URL = 'https://cors-anywhere.herokuapp.com/https://api.goshippo.com/tracks';
// let API_URL = 'https://cors-proxy.picsoung.workers.dev/' //'https://fsv0sd03ta.execute-api.us-east-1.amazonaws.com/prod'

/**
 * GIO FIX 2020-09-25
 *  Only this function is working.  We wrote our own API wrapper for this
 *  to send data to Shippo's API
 *  
 */
export const getTrackingInfo = async ({
  carrier,
  trackingNumber,
  apikey,
  onSuccess,
  onError
}) => {
  try {
    const res = await axios.get(
      `${API_URL}/${carrier}/${trackingNumber}`, {
        headers: {
          Authorization: `ShippoToken ${apikey}`,
          "Content-Type": "application/json"
        }
      }
    );

    onSuccess(res.data);
    return;
  } catch (err) {
    console.log("ERR FETCHING DATA: ", err);
    const error = {
      err: err.response.data,
      status: err.response.status
    }
    onError(error);
    return;
  }
}

export const createShipment = async ({
  fromDetails,
  toDetails,
  parcel,
  onSuccess,
  onError
}) => {
  bearerClient
    .integration("goshippo")
    .post(`/shipments/`, {
      body: {
        address_from: fromDetails,
        address_to: toDetails,
        parcels: [{
          "length": "5",
          "width": "5",
          "height": "5",
          "distance_unit": "in",
          "weight": "2",
          "mass_unit": "lb"
        }]
      }
    })
    .then(({
      data
    }) => {
      onSuccess && onSuccess(data);
    })
    .catch(err => {
      console.log("getTrackingInfo Error: ", err.response.data);
    })
}

export const createTransaction = async ({
  rate,
  onSuccess,
  onError
}) => {
  bearerClient
    .integration("goshippo")
    .post(`/transactions/`, {
      body: {
        rate,
        async: "false"
      }
    })
    .then(({
      data
    }) => {
      onSuccess && onSuccess(data);
    })
    .catch(err => {
      console.log("createTransaction Error: ", err);
    })
}