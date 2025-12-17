import React, { useContext, useMemo, useCallback } from "react";
import { Placemark, Clusterer } from "react-yandex-maps";

import { Context as LangContext } from "../../Context/LangContext";
import CardTools from "../../Utils/cardTools";
import content from "../../Localization/Content";
import PlacemarkIcon from "../../Assets/Img/Icon/placemark-brand.svg";

/* ---------------- jitter helpers ---------------- */

const roundCoordKey = (lat, lon, precision = 6) =>
  `${Number(lat).toFixed(precision)}:${Number(lon).toFixed(precision)}`;

const metersToLatDegrees = (m) => m / 111_320;
const metersToLonDegrees = (m, lat) =>
  m / (111_320 * Math.cos((lat * Math.PI) / 180) || 1e-9);

function jitterLatLon(lat, lon, idx, total, jitterMeters = 6) {
  if (total <= 1) return [lat, lon];
  const angle = (2 * Math.PI * idx) / total;
  const rMeters = jitterMeters * (0.7 + 0.3 * (idx / Math.max(total - 1, 1)));

  const dLat = metersToLatDegrees(rMeters) * Math.sin(angle);
  const dLon = metersToLonDegrees(rMeters, lat) * Math.cos(angle);
  return [lat + dLat, lon + dLon];
}

/* ---------------- rendering helpers ---------------- */

function getFullImageUrl(advert) {
  const img0 =
    Array.isArray(advert?.image) && advert.image.length > 0
      ? advert.image[0]
      : undefined;

  const url = img0?.url || "";
  return url ? process.env.REACT_APP_URL + url : "";
}

function buildBalloonHtml({ advertLink, fullImageUrl, advertTitle, price, advertAddress, detailedView }) {
  // Keep this as a pure function so it’s easy to memoize/call.
  return `<div class="mapBaloon">
    <div class="mapBaloon__header">
      <a href="${advertLink}" target="blank" mapBaloon__img__link>
        <img src="${fullImageUrl}" class="mapBaloon__img" alt=""/>
      </a>
    </div>
    <div class="mapBaloon__main">
      <h3 class="mapBaloon__title">${advertTitle}</h3>
      <div class="mapBaloon__main__actions">
        <p class="mapBaloon__price">${price}</p>
      </div>
    </div>
    <div class="mapBaloon__footer">
      <span class="mapBaloon__address">${advertAddress ?? ""}</span>
      <a href="${advertLink}" class="mapBaloon__link">${detailedView}</a>
    </div>
  </div>`;
}

export default function AdvertPlacemark({ data }) {
  const { lang } = useContext(LangContext);

  // 1) Normalize to array once
  const adverts = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  // 2) Filter + group + deterministically jitter, all memoized
  const points = useMemo(() => {
    const groups = new Map();

    for (const advert of adverts) {
      const lat = Number(advert?.latitude);
      const lon = Number(advert?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

      const key = roundCoordKey(lat, lon, 6);
      const arr = groups.get(key);
      if (arr) arr.push(advert);
      else groups.set(key, [advert]);
    }

    const out = [];
    for (const [, group] of groups) {
      // stable order so jitter assignment doesn’t change between renders
      group.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));

      const total = group.length;
      for (let idx = 0; idx < total; idx++) {
        const advert = group[idx];
        const lat = Number(advert.latitude);
        const lon = Number(advert.longitude);
        const [jLat, jLon] = jitterLatLon(lat, lon, idx, total, 6);

        out.push({ advert, geometry: [jLat, jLon] });
      }
    }

    return out;
  }, [adverts]);

  // 3) Callback avoids recreating the function each render
  const renderPlacemark = useCallback(
    ({ advert, geometry }) => {
      const { price, advertTitle, advertLink, advertType, advertAddress } =
        CardTools(advert);

      const fullImageUrl = getFullImageUrl(advert);
      const detailedView = content[lang].detailedView;

      const balloonContentBody = buildBalloonHtml({
        advertLink,
        fullImageUrl,
        advertTitle,
        price,
        advertAddress,
        detailedView,
      });

      return (
        <Placemark
          key={advert.id ?? `${advert.latitude}:${advert.longitude}:${advertTitle}`}
          index={advert.id}
          geometry={geometry}
          options={{
            openBalloonOnClick: true,
            iconLayout: "default#image",
            iconImageHref: PlacemarkIcon,
            iconImageSize: [26, 36],
          }}
          properties={{
            balloonContentBody,
            hintContent: `<div class="mapBaloon__type">${advertType}</div>`,
          }}
        />
      );
    },
    [lang]
  );

  if (!data) return null;

  return (
    <Clusterer
      options={{
        groupByCoordinates: false,
      }}
    >
      {points.map(renderPlacemark)}
    </Clusterer>
  );
}