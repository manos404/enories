import React from "react";
import "./Window.css";
import { Drawer } from "antd";
import "antd/dist/reset.css";
import MarkerForm from "./MarkerForm";
import PolygonForm from "./PolygonForm";

const Window = (props) => {
  let title;

  const onClose = () => {
    props.setOpen(false);
    props.setType(false);
  };

  if (props.type === "newMarker") title = "Create a new marker";
  else if (props.type === "editMarker") title = "Edit the marker";
  else if (props.type === "editPolygon") title = "Edit the Polygon";
  else if (props.type === "newPolygon") title = "Create a new polygon";

  return (
    <>
      <Drawer
        title={title}
        placement="left"
        width="25vw"
        height="100vh"
        onClose={onClose}
        open={props.open}
      >
        {props.type === "newMarker" && (
          <MarkerForm
            setFly={props.setFly}
            setOpen={props.setOpen}
            type={props.type}
            setRender={props.setRender}
            data={props.data} 
          />
        )}
        {props.type === "editMarker" && (
          <MarkerForm
            setFly={props.setFly}
            setOpen={props.setOpen}
            feature={props.feature}
            type={props.type}
            setRender={props.setRender}
            data={props.data}
          />
        )}

        {props.type === "newPolygon" && (
          <PolygonForm
          setRender={props.setRender}
            setOpen={props.setOpen}
            type={props.type}
          />
        )}

        {props.type === "editPolygon" && (
          <PolygonForm
            setOpen={props.setOpen}
            feature={props.feature}
            setRender={props.setRender}
            type={props.type}
          />
        )}
      </Drawer>
    </>
  );
};
export default Window;
