import React, { useState } from "react";
import { useMount } from "react-use";
import { Button, Modal, Row, Col, Typography, Alert } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import provincesService from "./../../../../services/settings/basic-info/provinces-service";
import DetailsTable from "./../../../common/details-table";

const { Text } = Typography;

const columns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "CityID",
    render: (CityID) => <Text>{utils.farsiNum(`${CityID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    ellipsis: true,
    dataIndex: "CityTitle",
    render: (CityTitle) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {utils.farsiNum(CityTitle)}
      </Text>
    ),
  },
];

const ProvinceCitiesModal = ({ province, isOpen, onOk }) => {
  const [cities, setCities] = useState([]);

  useMount(async () => {
    const data = await provincesService.getCitiesByProvinceID(
      province.ProvinceID
    );

    setCities(data);
  });

  return (
    <Modal
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.cities}
      footer={[
        <Button key="submit-button" type="primary" onClick={onOk}>
          {Words.confirm}
        </Button>,
      ]}
      onCancel={onOk}
      width={650}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Alert message={province.ProvinceTitle} type="info" showIcon />
            </Col>
            <Col xs={24}>
              <DetailsTable records={cities} columns={columns} />
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default ProvinceCitiesModal;
