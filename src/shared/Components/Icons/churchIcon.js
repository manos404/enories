import L from "leaflet";
import iconUrl from "./church.png"; 

const { iconSize, shadowSize, iconAnchor, popupAnchor, tooltipAnchor } =
  L.Marker.prototype.options.icon.options;

export const churchIcon = L.icon({
    iconUrl,
    
    iconSize:     [35, 35],
    // shadowSize:     [50, 50],
    iconAnchor,
    popupAnchor,
    tooltipAnchor,
});
