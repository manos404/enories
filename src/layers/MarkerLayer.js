import { Marker, Popup } from "react-leaflet";
import React from "react";

import { churchIcon } from "../shared/Components/Icons/churchIcon";
import { Button, Card, Space } from "antd";
// import "react-leaflet-markercluster/dist/styles.min.css";

import "./markerLayer.css";
import { AuthContext } from "../shared/context/auth-context";
import { useContext } from "react";

//

export const MarkerLayer = (props) => {
  const auth = useContext(AuthContext);

  const PopupStatistics = ({ feature }) => {
    const { coordinates } = feature.geometry;
    const { name } = feature.properties;
    const { id } = feature;

    function handleEdit() {
      props.setFeature(feature);
      props.setOpen(true);
      props.setType("editMarker");
    }

    const onDelete = async () => {
      try {
        props.setRender(null);
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + `/marker/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(response.message);
        }
        console.log(responseData);

        //props.setOpenLogIn(false)
      } catch (err) {
        console.log(err);
      }
    };

    return (
      <div>
        <Card
          title={<h3 style={{ textAlign: "left" }}> ΕΠΙΣΗΜΟ ΟΝΟΜΑ ΝΑΟΥ </h3>}
          size="small"
          style={{
            width: 340,
            marginTop: 10,
          }}
          hoverable
        >
          <p style={{ textAlign: "left" }}> {name} </p>
        </Card>
        <Space>
          <Card
            title={<h3 style={{ textAlign: "left" }}> Συντεταγμενες </h3>}
            size="small"
            style={{
              width: 340,
            }}
            hoverable
          >
            <p
              style={{
                textAlign: "left",
                marginRight: 50,
              }}
            >
              {coordinates[0]},{coordinates[1]}
            </p>
          </Card>
        </Space>

        {auth.isLoggedIn && (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button type="primary" htmlType="submit" onClick={handleEdit}>
              Edit
            </Button>
            <Button type="primary" onClick={onDelete} danger>
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  };

  let markers = props.data.features.map((feature) => {
    if (feature.geometry.type === "Point") {
      const { coordinates } = feature.geometry;
      const { id } = feature.properties;
      // name = feature.properties.title;
      return (
        <Marker key={id} position={coordinates} icon={churchIcon}>
          <Popup
            style={{
              width: 260,
              marginRight: 200,
            }}
          >
            <PopupStatistics feature={feature} id={id} />
          </Popup>
        </Marker>
      );
    }
  });

  return <>{markers}</>;
};
