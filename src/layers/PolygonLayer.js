import { Polygon, Popup } from "react-leaflet";

import { Button, Card } from "antd";
import { AuthContext } from "../shared/context/auth-context";
import { useContext } from "react";

export const PolygonLayer = (props) => {
  const auth = useContext(AuthContext);

  const onDelete = async (id) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/polygon/${id}`,
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
      props.setRender(null);
      //props.setOpenLogIn(false)
    } catch (err) {
      console.log(err);
    }
  };

  return props.data.features.map((feature) => {
    if (feature.geometry.type === "Polygon") {
      const { coordinates } = feature.geometry;

      function handleEdit() {
        props.setOpen(true);
        props.setType("editPolygon");
        props.setFeature(feature);
      }

      return (
        <Polygon id={feature.id} key={Math.random()} positions={coordinates}>
          <Popup>
            <Card
              title={
                <h3 style={{ textAlign: "left" }}> ΕΠΙΣΗΜΟ ΟΝΟΜΑ ΕΝΟΡΙΑΣ </h3>
              }
              size="small"
              style={{
                width: 340,
                marginTop: 10,
              }}
              hoverable
            >
              <p style={{ textAlign: "left" }}> {feature.properties.name}</p>
            </Card>
            {auth.isLoggedIn && (
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button type="primary" htmlType="submit" onClick={handleEdit}>
                  Edit
                </Button>
                <Button
                  type="primary"
                  onClick={() => onDelete(feature.id)}
                  danger
                >
                  Delete
                </Button>
              </div>
            )}
          </Popup>
        </Polygon>
      );
    }
  });
};
