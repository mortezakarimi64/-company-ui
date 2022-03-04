import React from "react";
import { Result, Button } from "antd";
import Words from "../resources/words";

const NotFoundPage = (props) => {
  const handleGoBack = () => {
    props.history?.goBack();
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle={Words.messages.page_not_found}
      extra={
        <Button type="primary" onClick={handleGoBack}>
          {Words.back}
        </Button>
      }
    />
  );
};

export default NotFoundPage;
