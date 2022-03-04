import React, { useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Popconfirm,
  Collapse,
  Alert,
  Tag,
  Typography,
  Space,
} from "antd";
import {
  QuestionCircleOutlined as QuestionIcon,
  PlusOutlined as PlusIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  UserOutlined as PersonIcon,
  EyeOutlined as VisibleIcon,
  EyeInvisibleOutlined as InvisibleIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import { handleError } from "../../../../tools/form-manager";
import { useModalContext } from "../../../contexts/modal-context";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import ModalWindow from "./../../../common/modal-window";
import NoteModal from "./user-members-missions-update-notes-modal";

const { Panel } = Collapse;
const { Text } = Typography;

const formRef = React.createRef();

const UserMembersMissionsNotesModal = ({
  isOpen,
  mission,
  onCancel,
  onSaveNote,
  onDeleteNote,
}) => {
  const { progress, setProgress } = useModalContext();

  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const handleDeleteNote = async (record) => {
    setProgress(true);

    try {
      record.MissionID = mission.MissionID;
      await onDeleteNote(record);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const getFooterButtons = () => {
    let footerButtons = [
      <Button
        type="primary"
        icon={<PlusIcon />}
        onClick={() => setShowModal(true)}
      >
        {Words.new_note}
      </Button>,

      <Button key="close-button" onClick={onCancel}>
        {Words.close}
      </Button>,
    ];

    return footerButtons;
  };

  const openNoteModal = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const genExtra = (note) => (
    <>
      {note.IsDeletable && (
        <Space>
          <Popconfirm
            title={Words.questions.sure_to_delete_note}
            onConfirm={async () => await handleDeleteNote(note)}
            okText={Words.yes}
            cancelText={Words.no}
            icon={<QuestionIcon style={{ color: "red" }} />}
            key="submit-confirm"
            disabled={progress}
          >
            <Button
              icon={<DeleteIcon style={{ color: Colors.red[6] }} />}
              loading={progress}
            />
          </Popconfirm>

          <Button
            icon={<EditIcon style={{ color: Colors.blue[6] }} />}
            onClick={() => openNoteModal(note)}
            disabled={progress}
          />
        </Space>
      )}
    </>
  );

  return (
    <>
      <ModalWindow
        visible={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.mission_notes}
        footer={getFooterButtons()}
        onCancel={onCancel}
        width={750}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            <Col xs={24}>
              <Form.Item>
                {mission.Notes.length > 0 ? (
                  <Collapse accordion>
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
                        extra={genExtra(note)}
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
                          <Col xs={24}>
                            {note.EmployeeSeenDate.length > 0 && (
                              <>
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
                              </>
                            )}

                            <Tag
                              icon={
                                note.VisibleForEmployee ? (
                                  <VisibleIcon />
                                ) : (
                                  <InvisibleIcon />
                                )
                              }
                              color={
                                note.VisibleForEmployee ? "magenta" : "red"
                              }
                            >
                              {note.VisibleForEmployee
                                ? Words.visible_for_employee
                                : Words.note_visible_for_employee}
                            </Tag>
                          </Col>
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

      {showModal && (
        <NoteModal
          onCancel={() => {
            setShowModal(false);
            setSelectedNote(null);
          }}
          onSaveNote={onSaveNote}
          isOpen={showModal}
          mission={mission}
          selectedNote={selectedNote}
        />
      )}
    </>
  );
};

export default UserMembersMissionsNotesModal;
