import Header from "../../Components/Header/Header";
import Search from "../../Components/Search/Search";
import { Provider as SearchContext } from "../../Context/SearchContext";
import AdvertMap from "../../Components/AdvertMap/AdvertMap";
import MapSearch from "../../Components/MapSearch/MapSearch";
import useWindowDimensions from "../../Utils/windowDimension";
import { useContext } from "react";
import { IPContext } from "../../Context/IPContext";

import "./SearchMap.scss";

function SearchMap() {
  const { windowWidth } = useWindowDimensions();
  const { IP } = useContext(IPContext);
  
  const defaultLatitude = 40.788059;
  const defaultLongitude = 72.308069;

  const initialLatitude = IP?.latitude || defaultLatitude;
  const initialLongitude = IP?.longitude || defaultLongitude;
  
  const initialCoordinates = [initialLatitude, initialLongitude];

  return (
    <SearchContext>
      <div className="searchMap" id="searchMap">
        <Header />
        <Search map={windowWidth > 1000 ? true : false} />
        <div className="searchMap__content">
          <div className="searchMap__map">
            <AdvertMap coordinate={initialCoordinates} zoom={10} />
          </div>
          {windowWidth > 666 ? <MapSearch /> : ""}
        </div>
      </div>
    </SearchContext>
  );
}
export default SearchMap;