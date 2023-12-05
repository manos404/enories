import React, {useContext } from "react";
import { Card, Form, Input, Button, Drawer } from "antd";
import "antd/dist/reset.css";
import "./LogInDrawer.css";
import { AuthContext } from "../shared/context/auth-context";

const ListDrawer = (props) => {
  const [form] = Form.useForm();
  const auth = useContext(AuthContext);

  const onClose = () => {
    props.setOpenLogIn(false);
  };
  const contentWrapperStyle = {
    width: " 0px",
    backgroundColor: "lightblue", // Προσαρμόστε το background-color όπως επιθυμείτε
  };

  const onFinish = async (event) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: event.username,
            password: event.password,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(response.message);
      }

      // SetIsLogging(true); /////
      auth.login();
      props.setOpenLogIn(false);
      console.log("logingg");
      //props.setOpenLogIn(false)
    } catch (err) {
      console.log(err);
    }
  };

  const logOut = () => {
    auth.logout();
    props.setOpenLogIn(false);
  };

  return (
    <>
      <Drawer
        open={props.open}
        title="Log In"
        placement="left"
        onClose={onClose}
        contentWrapperStyle={contentWrapperStyle}
        style={{
          position: "fixed",
          bottom: "0px",
          width: "300px",
          height: "400px",
        }}
      >
        <>
          {!auth.isLoggedIn ? (
            <Form form={form} onFinish={onFinish}>
              <Card
                title={<h3 style={{ textAlign: "left" }}> Username </h3>}
                size="small"
                style={{
                  marginTop: 0,
                }}
                hoverable
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Το username είναι υποχρεωτικό",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Card>

              <Card
                title={<h3 style={{ textAlign: "left" }}> Password </h3>}
                size="small"
                style={{
                  marginTop: 15,
                }}
                hoverable
              >
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Το password είναι υποχρεωτικό",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Card>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    marginLeft: "35%",
                    marginTop: "10px",
                  }}
                >
                  Log In
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <>
              <h2
                style={{
                  marginLeft: "38%",
                  marginTop: "50px",
                }}
              >
                Admin
              </h2>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  marginLeft: "33%",
                  marginTop: "50px",
                }}
                onClick={logOut}
              >
                Log Out
              </Button>
            </>
          )}
        </>
      </Drawer>
    </>
  );
};

export default ListDrawer;
