import React from "react";
import { Form, Row, Col, Button, Collapse, Alert, Tag, Typography } from "antd";
import {
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  UserOutlined as PersonIcon,
  EyeOutlined as VisibleIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import ModalWindow from "./../../../common/modal-window";
import { handleError } from "./../../../../tools/form-manager";

const { Panel } = Collapse;
const { Text } = Typography;

const formRef = React.createRef();

const UserMyMissionsNotesModal = ({ isOpen, mission, onCancel, onSeen }) => {
  const handleCollapseChange = async (key) => {
    if (key) {
      const note = mission.Notes.filter((n) => n.NoteID === parseInt(key));

      if (note) {
        try {
          await onSeen(note[0]);
        } catch (err) {
          handleError(err);
        }
      }
    }
  };

  return (
    <ModalWindow
      visible={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.mission_notes}
      footer={[
        <Button key="close-button" onClick={onCancel}>
          {Words.close}
        </Button>,
      ]}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <Form.Item>
              {mission.Notes.length > 0 ? (
                <Collapse accordion onChange={handleCollapseChange}>
                  {mission.Notes.map((note) => (
                    <Panel
                      key={note.NoteID}
                      header={
                        <Row gutter={[1, 5]}>
                          <Col xs={24} md={19}>
                            <Tag icon={<CalendarIcon />} color="blue">
                              {`${utils.weekDayNameFromText(
                                note.RegDate
                              )} ${utils.farsiNum(
                                utils.slashDate(note.RegDate)
                              )}`}
                            </Tag>

                            <Tag icon={<ClockIcon />} color="blue">
                              {utils.farsiNum(utils.colonTime(note.RegTime))}
                            </Tag>
                          </Col>
                          <Col xs={24} md={5}>
                            <Tag icon={<PersonIcon />} color="purple">
                              {`${note.RegFirstName} ${note.RegLastName}`}
                            </Tag>
                          </Col>
                        </Row>
                      }
                    >
                      <Row gutter={[1, 5]}>
                        <Col xs={24}>
                          <Text
                            style={{
                              color: Colors.purple[7],
                              whiteSpace: "pre-line",
                            }}
                          >
                            {utils.farsiNum(note.DetailsText)}
                          </Text>
                        </Col>
                        {note.EmployeeSeenDate.length > 0 && (
                          <Col xs={24}>
                            <Tag icon={<VisibleIcon />} color="green">
                              {`${utils.weekDayNameFromText(
                                note.EmployeeSeenDate
                              )} ${utils.farsiNum(
                                utils.slashDate(note.EmployeeSeenDate)
                              )}`}
                            </Tag>

                            <Tag icon={<ClockIcon />} color="green">
                              {utils.farsiNum(
                                utils.colonTime(note.EmployeeSeenTime)
                              )}
                            </Tag>
                          </Col>
                        )}
                      </Row>
                    </Panel>
                  ))}
                </Collapse>
              ) : (
                <Alert
                  message={Words.messages.no_note_submitted_yet}
                  type="warning"
                  showIcon
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserMyMissionsNotesModal;
