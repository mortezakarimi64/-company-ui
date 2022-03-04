import React, { useState } from "react";
import { useMount } from "react-use";
// import { Row, Col } from "antd";
// import DashboardTile from "../../../common/dashboard-tile";
// import { GiGuards as SecurityguardIcon } from "react-icons/gi";
// import Colors from "../../../../resources/colors";
import modulesService from "../../../../services/app/modules-service";

// const iconProps = {
//   size: 55,
//   style: { marginTop: 10 },
// };

// const mapper = (pageID) => {
//   let link = "";
//   let icon = null;
//   let backColor = Colors.blue[3];

//   switch (pageID) {
//     case 12:
//       link = "security-guards";
//       icon = <SecurityguardIcon {...iconProps} />;
//       backColor = Colors.green[3];
//       break;

//     // case 4:
//     //   link = "org-chart";
//     //   icon = <OrgChartIcon {...iconProps} />;
//     //   backColor = Colors.orange[3];
//     //   break;

//     // case 5:
//     //   link = "roles";
//     //   icon = <RoleIcon {...iconProps} />;
//     //   backColor = Colors.blue[3];
//     //   break;

//     // case 6:
//     //   link = "companies";
//     //   icon = <CompanyIcon {...iconProps} />;
//     //   backColor = Colors.volcano[3];
//     //   break;

//     // case 7:
//     //   link = "members";
//     //   icon = <MemberIcon {...iconProps} />;
//     //   backColor = Colors.magenta[6];
//     //   break;

//     // case 8:
//     //   link = "employees";
//     //   icon = <EmployeeIcon {...iconProps} />;
//     //   backColor = Colors.geekblue[6];
//     //   break;

//     // case 9:
//     //   link = "company-agents";
//     //   icon = <AgentIcon {...iconProps} />;
//     //   backColor = Colors.gold[6];
//     //   break;

//     // case 10:
//     //   link = "duty-levels";
//     //   icon = <DutyLevelIcon {...iconProps} />;
//     //   backColor = Colors.magenta[4];
//     //   break;

//     // case 11:
//     //   link = "duties";
//     //   icon = <DutyIcon {...iconProps} />;
//     //   backColor = Colors.red[4];
//     //   break;

//     default:
//       break;
//   }

//   return { link, icon, backColor };
// };

const TimexDashboard = () => {
  let [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const timex_module_id = 4;
    accessiblePages = await modulesService.accessiblePages(timex_module_id);

    setAccessiblePages(accessiblePages);
  });

  return (
    <h1>Timex Dashboard</h1>
    // <Row gutter={[10, 16]}>
    //   {accessiblePages.map((page) => (
    //     <Col xs={24} md={8} lg={6} key={page.PageID}>
    //       <DashboardTile
    //         to={`timex/${mapper(page.PageID).link}`}
    //         icon={mapper(page.PageID).icon}
    //         backColor={mapper(page.PageID).backColor}
    //         title={page.PageTitle}
    //       />
    //     </Col>
    //   ))}
    // </Row>
  );
};

export default TimexDashboard;
