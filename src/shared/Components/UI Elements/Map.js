import {
  FeatureGroup,
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";

//import "react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";

import React, { useContext, useEffect, useState } from "react";
import "leaflet-draw/dist/leaflet.draw.css";
import "./Map.css";
import { PolygonLayer } from "../../../layers/PolygonLayer";
import { MarkerLayer } from "../../../layers/MarkerLayer";
import {
  EnvironmentOutlined,
  LoginOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Window from "../../../components/Window";
import { PolygonIcon } from "../Icons/PolygonIcon";
import ListDrawer from "../../../components/ListDrawer";

import LogInDrawer from "../../../components/LogInDrawer";
import { EditControl } from "react-leaflet-draw";
import { marker } from "leaflet";

import { AuthContext } from "../../context/auth-context";

export default function Map(props) {
  const [type, setType] = useState(false);
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState();
  const [parishes, setParishes] = useState("ΟΛΕΣ ΟΙ ΕΝΟΡΙΕΣ");
  const [openList, setOpenList] = useState(false);
  const [fly, setFly] = useState();
  const [openLogIn, setOpenLogIn] = useState();

  const auth = useContext(AuthContext);

  const handleSave = async (e) => {
    const { layers } = e;
    let editedPolygonsCoords = [];
    let id;
    let name;
    layers.eachLayer((layer) => {
      id = layer.options.id;

      const coordinates = layer.getLatLngs()[0].map((latlng) => {
        editedPolygonsCoords.push([latlng.lat, latlng.lng]);
      });
    });

    props.data.features.map((item) => {
      if (item.id === id) {
        marker = item;
      }
    });
    name = marker.properties.name;

    editedPolygonsCoords.push(editedPolygonsCoords[0]);

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/polygon/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            coordinates: editedPolygonsCoords,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(response.message);
      }

      // props.setData(null);
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  function FlyTo({ location }) {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.flyTo(location, 15);
        // console.log("fly");
      }
      setFly(null);
    });
  }

  let position = [35.342602, 25.1338537];

  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <FlyTo location={fly} />
      <button
        title="Log in"
        style={{
         // zIndex: 0,
          position: "absolute",
          left: "10px",
          bottom: "  50px",
          width: "35px",
          height: "35px",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          setOpenLogIn(true);
        }}
      >
        <LoginOutlined style={{ fontSize: "18px" }} />
      </button>
      {openLogIn && (
        <LogInDrawer
          open={openLogIn}
          setOpenLogIn={setOpenLogIn}
          setRender={props.setRender}
        />
      )}
      {
        <ListDrawer
          openList={openList}
          setOpenList={setOpenList}
          parishes={parishes}
          setParishes={setParishes}
          fly={fly}
          setFly={setFly}
          data={props.data}
          //setRender={props.setRender}
        />
      }
      {open && (
        <Window
          open={open}
          setOpen={setOpen}
          setType={setType}
          type={type}
          setFly={setFly}
          feature={feature}
          setRender={props.setRender}
          data={props.data}
        />
      )}
      {auth.isLoggedIn &&<button
        title="Create a marker"
        style={{
          position: "absolute",
          left: "10px",
          top: " 100px",
          width: "32px",
          height: "32px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          setOpen(true);
          setType("newMarker");
        }}
      >
        <EnvironmentOutlined style={{ fontSize: "18px" }} />
      </button>}

      {auth.isLoggedIn && <button
        title="Create a polygon"
        style={{
          position: "absolute",
          left: "10px",
          top: " 150px",
          width: "32px",
          height: "32px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          setOpen(true);
          setType("newPolygon");
        }}
      >
        <PolygonIcon />
      </button>}
      <button
        title="List"
        style={{
          position: "absolute",
          right: "10px",
          top: "  30px",
          width: "32px",
          height: "32px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          setOpenList(true);
        }}
      >
        <MenuOutlined />
      </button>

      <ZoomControl />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FeatureGroup>
       {auth.isLoggedIn && <EditControl
          position="topleft"
          top="100px"
          draw={{
            polygon: false,
            circle: false,
            rectangle: false,
            polyline: false,
            marker: false,
            circlemarker: false,
          }}
          edit={{ edit: true, remove: false }}
          onEdited={handleSave}
          onEditStart={(e) => {}}
        />}

        <PolygonLayer
          data={props.data}
          open={open}
          setOpen={setOpen}
          setType={setType}
          type={type}
          setFeature={setFeature}
          feature={feature}
          setRender={props.setRender}
        />
      </FeatureGroup>

      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer name="Clustered Markers">
          <MarkerClusterGroup>
            <MarkerLayer
              data={props.data}
              open={open}
              setOpen={setOpen}
              setType={setType}
              type={type}
              setFly={setFly}
              setFeature={setFeature}
              feature={feature}
              setRender={props.setRender}
            />
          </MarkerClusterGroup>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Layer group with Markers">
          <LayerGroup>
            <MarkerLayer
              data={props.data}
              open={open}
              setOpen={setOpen}
              setType={setType}
              type={type}
              setFly={setFly}
              setFeature={setFeature}
              feature={feature}
              setRender={props.setRender}
            />
          </LayerGroup>
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  );
}
