import React from "react";
import "./PolygonForm.css";
import { Button } from "antd";
import { Card } from "antd";
import { Input } from "antd";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";

const PolygonForm = (props) => {
  const [form] = Form.useForm();

  const initialValues = {};

  const createNewPolygon = async () => {
    const values = form.getFieldsValue();
    const coordinates = [];
    let coords = values.edges.split("\n");
    for (let i = 0; i < coords.length; i++) {
      const [lat, lon] = coords[i].split(",").map(parseFloat);
      coordinates.push([lat, lon]);
    }
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +`/polygon`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            coordinates: coordinates,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(response.message);
      }
      props.setOpen(false);
      props.setRender(null);
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  const editPolygon = async () => {
    const values = form.getFieldsValue();
    const coordinates = [];
    let coords = values.edges.split("\n");
    for (let i = 0; i < coords.length; i++) {
      const [lat, lon] = coords[i].split(",").map(parseFloat);
      coordinates.push([lat, lon]);
    }
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL+`/polygon/${props.feature.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            coordinates: coordinates,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(response.message);
      }
      props.setOpen(false);
      props.setRender(null);
      console.log(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  if (props.feature) {
    initialValues["name"] = props.feature.properties.name;

    initialValues["edges"] = props.feature.geometry.coordinates
      .map(([lat, lon]) => `${lat},${lon}`)
      .join("\n");
  }

  return (
    <>
      <Form
        form={form}
        onFinish={props.type === "newPolygon" ? createNewPolygon : editPolygon}
        initialValues={initialValues}
      >
        <Card
          title={<h3 style={{ textAlign: "left" }}> ΟΝΟΜΑ ΕΝΟΡΙΑΣ </h3>}
          size="small"
          style={{
            width: "22vw",
            marginTop: 10,
          }}
          hoverable
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Η ενορια είναι υποχρεωτικη",
              },
            ]}
          >
            <Input style={{ width: "20vw" }} />
          </Form.Item>
        </Card>

        <Card
          title={<h3 style={{ textAlign: "left" }}> ΣΗΜΕΙΑ ΠΟΛΥΓΩΝΟΥ </h3>}
          size="small"
          style={{
            width: "22vw",
            marginTop: 10,
          }}
          hoverable
        >
          <Form.Item
            name="edges"
            rules={[
              {
                required: true,
                message: "Το πεδιο είναι υποχρεωτικό",
              },
            ]}
          >
            <TextArea rows={15} />
          </Form.Item>
        </Card>

        <Form.Item>
          <Button
            style={{
              width: "5vw",
              marginLeft: "10vw",
              marginTop: "1vw",
            }}
            type="primary"
            htmlType="submit"
          >
            {props.type === "newPolygon" ? "Create" : "Edit"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PolygonForm;
