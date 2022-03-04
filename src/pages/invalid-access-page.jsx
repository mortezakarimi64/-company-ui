import React from "react";
import { Result, Button } from "antd";
import Words from "../resources/words";

const NotFoundPage = (props) => {
  const handleGoBack = () => {
    props.history?.goBack();
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle={Words.messages.invalid_access_page}
      extra={
        <Button type="primary" onClick={handleGoBack}>
          {Words.back}
        </Button>
      }
    />
  );
};

export default NotFoundPage;
