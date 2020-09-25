import React, { useState, useEffect } from "react";
import {
  useGlobalConfig,
  useWatchable,
  useRecordById,
  useBase,
  Button,
  Box,
  Heading,
  Text,
  Link,
  FormField,
  InputSynced,
  FieldPickerSynced,
  TablePickerSynced,
  colors,
  Loader,
} from "@airtable/blocks/ui";

import { cursor } from "@airtable/blocks";
import { getTrackingInfo } from "../functions/shippo";
import LocationDetails from "./LocationDetails";
import DateDetails from "./DateDetails";
import TrackingHistory from "./TrackingHistory";
import FromTo from "./FromTo";

const TrackingDetails = ({
  activeTable,
  selectedRecordId,
  trackingNumber,
  carrierName,
}) => {
  const base = useBase();
  const globalConfig = useGlobalConfig();
  const [trackingInfos, setTrackingInfos] = useState(null);
  const [loading, setLoading] = useState(!trackingInfos);

  useEffect(() => {
    setLoading(true);
    getTrackingInfo({
      carrier: carrierName,
      trackingNumber: trackingNumber,
      apikey: globalConfig.get("shippoAPIKey"),
      onSuccess: (data) => {
        setLoading(false);
        setTrackingInfos(data);
      },
      onError: (err) => {
        setLoading(false);
        setTrackingInfos(err);
      },
    });
  }, [trackingNumber, carrierName]);

  return !loading && trackingInfos && trackingNumber ? (
    <Box>
      {trackingInfos.err === undefined ? (
        <Box>
          <FromTo
            from={trackingInfos.address_from}
            to={trackingInfos.address_to}
          />
          <Heading>Latest</Heading>
          <Box
            border="thick"
            backgroundColor="lightGray2"
            borderRadius="large"
            padding={3}
          >
            <Text>{trackingInfos.tracking_status.status_details}</Text>
            <DateDetails date={trackingInfos.tracking_status.status_date} />
            <LocationDetails
              pinColor={colors.GREEN_LIGHT_1}
              location={trackingInfos.tracking_status.location}
            />
          </Box>
          <TrackingHistory history={trackingInfos.tracking_history} />
        </Box>
      ) : (
        <Box>
          <h1>Error fetching data</h1>
          <pre>{JSON.stringify(trackingInfos, null, 2)}/</pre>
        </Box>
      )}
    </Box>
  ) : (
    <Loader />
  );
};

export default TrackingDetails;
