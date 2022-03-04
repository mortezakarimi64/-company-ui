import React, { useState } from "react";
import { useMount } from "react-use";
import service from "../../../../services/settings/org/departments-service";
import { OrganizationGraph } from "@ant-design/charts";
import { Button, Space, Spin /* Row, Typography */ } from "antd";
import { FcParallelTasks } from "react-icons/fc";
//---
import { fileBasicUrl } from "../../../../config.json";
import utils from "../../../../tools/utils";
import DepartmentMembersModal from "../../settings/org/department-members-modal";
import Words from "../../../../resources/words";
import {
  AiOutlineFullscreen,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
} from "react-icons/ai";
import { useModalContext } from "../../../contexts/modal-context";
//---

// const { Text } = Typography;

const UserOrgChartPage = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [departmentID, setDepartmentID] = useState(0);
  const [departmentTitle, setDepartmentTitle] = useState("");
  const [chartType, setChartType] = useState("TB");
  const [chartTypes] = useState([
    { deg: 90, name: "TB" },
    { deg: 270, name: "BT" },
    { deg: 0, name: "LR" },
    { deg: 180, name: "RL" },
  ]);

  const { progress, setProgress } = useModalContext();

  useMount(async () => {
    setProgress(true);
    const data = await service.getAllData();
    setDepartments(data);
    setProgress(false);
  });

  const handleShowModal = (departmentID, departmentTitle, shape) => {
    if (shape !== "marker") {
      setDepartmentTitle(departmentTitle);
      setDepartmentID(departmentID);
      setShowModal(true);
    }
  };

  const getNodes = (departments) => {
    let node_list = {};

    if (departments.length > 0) {
      node_list = getAntdNodes(
        departments.filter((n) => n.ParentDepartmentID === 0)[0],
        departments
      );
    }

    return node_list;
  };

  const getAntdNodes = (department, depList) => {
    let children = [];

    const {
      DepartmentID,
      DepartmentTitle,
      Manager,
      Supervisor,
      EmployeesCount,
    } = department;

    const subDepartments = depList.filter(
      (d) => d.ParentDepartmentID === DepartmentID
    );

    subDepartments.forEach((dep) => {
      children = [...children, getAntdNodes(dep, depList)];
    });

    return {
      id: `${DepartmentID}`,
      value: {
        text: utils.farsiNum(DepartmentTitle),
        image: Manager
          ? Manager.PicFileName
          : Supervisor
          ? Supervisor.PicFileName
          : "",
        employeesCount: EmployeesCount,
        fullName: Manager
          ? `${Manager.FirstName} ${Manager.LastName}`
          : Supervisor
          ? `${Supervisor.FirstName} ${Supervisor.LastName}`
          : "",
        isManager: Manager !== null,
        isSupervisor: Manager !== null,
      },
      children,
    };
  };

  const organizChart = () => {
    return (
      <>
        <OrganizationGraph
          data={getNodes(departments)}
          style={{ width: "100vw", height: "110vh" }}
          toolbarCfg={{
            show: true,
            zoomFactor: 5,
            renderIcon: (
              zoomIn = () => {},
              zoomOut = () => {},
              toggleFullscreen = () => {},
              handleSwitchChart = (name) => {
                setChartType(name);
              }
            ) => (
              <Space align="center">
                <Button
                  type="link"
                  onClick={zoomIn}
                  icon={<AiOutlineZoomIn />}
                />
                <Button
                  type="link"
                  onClick={zoomOut}
                  icon={<AiOutlineZoomOut />}
                />
                <Button
                  type="link"
                  onClick={toggleFullscreen}
                  icon={<AiOutlineFullscreen />}
                />
                {chartTypes.map((t, inx) => (
                  <Button
                    key={inx}
                    type="link"
                    icon={
                      <FcParallelTasks
                        style={{
                          fontSize: "15px",
                          transform: `rotate(${t.deg}deg)`,
                        }}
                      />
                    }
                    onClick={() => handleSwitchChart(t.name)}
                  />
                ))}
              </Space>
            ),
          }}
          behaviors={["drag-canvas", "zoom-canvas", "drag-node"]}
          markerCfg={(node) => {
            return {
              show: node.children.length > 0 ? true : false,
              collapsed: true,
              position: "bottom",
            };
          }}
          // tooltipCfg={{
          //   className: "tooltipOrg",
          //   show: true,
          //   style: { width: "auto" },
          //   customContent: (item) => (
          //     <Row
          //       align="middle"
          //       style={{ display: "flex", flexDirection: "column" }}
          //     >
          //       <Text style={{ fontSize: "smaller", color: "blue" }}>
          //         {item.value.text}
          //       </Text>
          //       <Text style={{ fontSize: "smaller" }}>
          //         {item.value.fullName
          //           ? `${Words.department_manager} : ${item.value.fullName}`
          //           : Words.no_department_manager}
          //       </Text>
          //       <Text style={{ fontSize: "smaller" }}>
          //         {item.value.employeesCount > 0
          //           ? `${Words.employees} : ${utils.farsiNum(
          //               item.value.employeesCount
          //             )} ${Words.nafar}`
          //           : Words.no_employee}
          //       </Text>
          //     </Row>
          //   ),
          // }}
          layout={{
            direction: chartType,
            getWidth: () => {
              return 300;
            },
            getHeight: () => {
              return 100;
            },
            getVGap: () => {
              return 25;
            },
            getHGap: () => {
              return 25;
            },
          }}
          nodeCfg={{
            style: (node) => {
              if (node.children.length > 0) {
                return {
                  fill: "#5B8FF9",
                  stroke: "blue",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                };
              } else {
                return {
                  fill: "#B1ABF4",
                  stroke: "blue",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                };
              }
            },

            size: [260, 100],

            customContent: (item, group, cfg) => {
              const { startX, startY, width } = cfg;
              const {
                text,
                image,
                fullName,
                employeesCount,
                isManager,
                // isSupervisor,
              } = item;

              const textShape1 =
                text &&
                group?.addShape("text", {
                  attrs: {
                    x: startX + width / 2,
                    y: startY + 25,
                    text,
                    fill: "black",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                    fontFamily: "Yekan",
                    fontSize: 20,
                    fontWeight: "bolder",
                  },
                  // Unique field within group
                  name: `text-${Math.random()}`,
                });

              const textShape2 =
                text &&
                group?.addShape("text", {
                  attrs: {
                    x: image ? startX + width / 2 - 30 : startX + width / 2,
                    y: startY + 50,
                    text:
                      fullName.length > 0
                        ? `${
                            isManager
                              ? Words.department_manager
                              : Words.department_supervisor
                          } : ${fullName}`
                        : Words.no_department_manager_or_supervisor,
                    fill: "black",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Yekan",
                    position: "absolute",
                  },
                  font: {
                    size: 34,
                  },
                  // Unique field within group
                  name: `text2-${Math.random()}`,
                });

              const textShape3 = group?.addShape("text", {
                attrs: {
                  x:
                    image.length > 0
                      ? startX + width / 2 - 30
                      : startX + width / 2,
                  y: startY + 70,
                  text:
                    employeesCount > 0
                      ? `${Words.employees} : ${utils.farsiNum(
                          employeesCount
                        )} ${Words.nafar}`
                      : Words.no_employee,
                  fill: "black",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: "Yekan",
                },
                // Unique field within group
                name: `text3-${Math.random()}`,
              });

              const textShape4 =
                text &&
                group?.addShape("image", {
                  attrs: {
                    x: startX + 180,
                    y: startY + 23,
                    width: 60,
                    height: 60,
                    img: image
                      ? `${fileBasicUrl}/${"member-profiles"}/${image}`
                      : "",
                  },
                  // Unique field within group
                  name: `text4-${Math.random()}`,
                });

              return Math.max(
                textShape1?.getBBox().height ?? 0,
                textShape2?.getBBox().height ?? 0,
                textShape3?.getBBox().height ?? 0,
                textShape4?.getBBox().height ?? 0
              );
            },
          }}
          onReady={(graph) => {
            graph.on("node:click", (evt) => {
              const item = evt.item._cfg;
              const shape = evt.shape.cfg;

              handleShowModal(item.id, item.model.value.text, shape.type);
            });
            graph.zoom(0.4, { x: 100, y: 300 });
          }}
        />
      </>
    );
  };

  return (
    <>
      <Spin spinning={progress} tip={Words.please_wait}>
        {departments.length > 0 && organizChart(chartType)}

        {showModal && (
          <DepartmentMembersModal
            onOk={() => {
              setShowModal(false);
            }}
            isOpen={showModal}
            departmentID={departmentID}
            departmentTitle={departmentTitle}
          />
        )}
      </Spin>
    </>
  );
};

export default UserOrgChartPage;
