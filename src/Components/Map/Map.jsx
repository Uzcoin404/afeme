// Import => React and Hooks
import React, { useEffect, useState, useContext } from "react";
// Import MUI
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// HTTP Request
import axios from "axios";
// Import Yandex Maps
import {
  YMaps,
  Map,
  Placemark,
  ZoomControl,
  GeolocationControl,
} from "react-yandex-maps";

import { Context } from "../../Context/LangContext";
// Import the IP Context
import { IPContext } from "../../Context/IPContext";
import content from "../../Localization/Content";

// Import Components
import style from "./Map.module.scss";

const DefaultZoom = 10;
// Fallback coordinates (if IP data is unavailable or incomplete)
const FallbackCenter = [41.311158, 69.279737]; // Tashkent, Uzbekistan

let url = process.env.REACT_APP_URL;

function MapComponent({
  street,
  setStreet,
  city_id,
  setCity,
  region_id,
  setRegionID,
  house,
  setHouse,
}) {
  // *** 1. Consume the IP Context ***
  const { IP } = useContext(IPContext);
  const { lang } = useContext(Context);

  // Helper function to determine the initial coordinates
  const getInitialCoords = () => {
    try {
      if (IP && IP.latitude && IP.longitude) {
        // Yandex uses [lat, lng]
        return [IP.latitude, IP.longitude];
      }
    } catch (e) {
      console.error("Error parsing IP context for coordinates:", e);
    }
    return FallbackCenter;
  };

  const getYMapsLang = (contextLang) => {
    switch (contextLang) {
      case "uz":
        return "uz_UZ";
      case "ru":
        return "ru_RU";
      case "en":
        return "en_US";
      default:
        return "uz_UZ";
    }
	};
	const yMapsLang = getYMapsLang(lang);

  // Get the initial coordinates using the IP data
  const initialCoords = getInitialCoords();

  // *** 2. Update state initial values ***
  // Center and Marker now start at the IP location or the fallback.
  const [mapCenter, setMapCenter] = useState(initialCoords);
  const [zoom, setZoom] = useState(DefaultZoom);
  const [markerCoords, setMarkerCoords] = useState(initialCoords);

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  function setLocation(lat, lng) {
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lng);
  }

  // Handle click on map to set location
  const onMapClick = (e) => {
    const coords = e.get("coords");

    // Set the marker to the exact click location
    setMarkerCoords(coords);

    // Also update the map center to follow the marker for consistency
    setMapCenter(coords);

    setLocation(coords[0], coords[1]);
  };

  // Handle dragging the marker
  const onDragEnd = (e) => {
    const coords = e.originalEvent.target.geometry.getCoordinates();
    setMarkerCoords(coords);
    setLocation(coords[0], coords[1]);
  };

  // Handler: Update Marker to Center when Map moves (pan/zoom)
  const onBoundsChange = (e) => {
    const newCenter = e.get("newCenter");
    const newZoom = e.get("newZoom");

    setMapCenter(newCenter);
    setZoom(newZoom);

    // Set the marker to the new center of the map
    setMarkerCoords(newCenter);

    // Save the new location immediately
    setLocation(newCenter[0], newCenter[1]);
  };

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await axios.get(`${url}regions`);
        if (res && res.data) {
          let data = res.data.data;
          setRegions(data);
        } else {
          console.error("Failed to fetch regions data");
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();

    // Set initial location to the calculated starting point on mount
    setLocation(initialCoords[0], initialCoords[1]);
  }, []); // Empty dependency array ensures this runs only once

  const Selector = (id) => {
    setRegionID(id);
    let filtered = regions.filter((item) => item.id === id);
    if (filtered.length > 0) {
      setCities(filtered[0].citys);
    } else {
      setCities([]);
    }
  };

  return (
    <div>
      <div className={style.InpG}>
        <FormControl className={style.select}>
          <InputLabel id="viloyat">{content[lang].form_select_vil}</InputLabel>
          <Select
            className={style.select}
            labelId={content[lang].form_select_vil}
            id={String(region_id)}
            label={content[lang].form_select_vil}
            value={region_id || ""}
            onChange={(e) => Selector(e.target.value)}
          >
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {lang === "uz"
                  ? region.name_uz
                  : lang === "ru"
                  ? region.name_ru
                  : region.name_en}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={style.select}>
          <InputLabel id="Shaxar">{content[lang].adverd_adres_city}</InputLabel>
          <Select
            className={style.select}
            labelId={content[lang].adverd_adres_city}
            id={String(city_id)}
            label={content[lang].adverd_adres_city}
            value={city_id || ""}
            onChange={(e) => setCity(e.target.value)}
          >
            {cities?.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name_uz}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <input
          className={style.input}
          type="text"
          value={street || ""}
          placeholder={content[lang].adverd_office}
          onChange={(e) => setStreet(e.target.value)}
        />
        <input
          className={style.input}
          type="text"
          value={house || ""}
          placeholder={content[lang].adverd_house_num}
          onChange={(e) => setHouse(e.target.value)}
        />
      </div>

      {/* Yandex Map Implementation */}
      <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
        <YMaps query={{ lang: yMapsLang }}>
          <Map
            state={{ center: mapCenter, zoom: zoom }}
            width="100%"
            height="100%"
            onBoundsChange={onBoundsChange}
            onClick={onMapClick}
          >
            <Placemark
              geometry={markerCoords}
              options={{ draggable: true }}
              onDragEnd={onDragEnd}
            />
            <ZoomControl options={{ float: "right" }} />
            <GeolocationControl options={{ float: "left" }} />
          </Map>
        </YMaps>
      </div>
    </div>
  );
}

export default MapComponent;
