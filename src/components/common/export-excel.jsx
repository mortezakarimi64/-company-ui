import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExportExcel = (props) => {
  const { sheets, fileName, button } = props;

  return (
    <ExcelFile element={button} filename={fileName}>
      {sheets.map((sheet, sheet_index) => (
        <ExcelSheet key={sheet_index} data={sheet.data} name={sheet.title}>
          {sheet.columns.map((column, index) => (
            <ExcelColumn
              key={index}
              label={column.label}
              value={column.value}
            />
          ))}
        </ExcelSheet>
      ))}
    </ExcelFile>
  );
};

export default ExportExcel;
