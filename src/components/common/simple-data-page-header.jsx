import React from "react";
import { Col, Typography, Input, Space, Tooltip, Button } from "antd";
import {
  SearchOutlined as SearchIcon,
  ReloadOutlined as ReloadIcon,
  PlusOutlined as PlusIcon,
  DownloadOutlined as DownloadIcon,
  SnippetsOutlined as ViewAllIcon,
} from "@ant-design/icons";
import ExportExcel from "../common/export-excel";
import Words from "../../resources/words";

const { Text } = Typography;
const { Search } = Input;

const SimpleDataPageHeader = ({
  title,
  searchText,
  sheets,
  fileName,
  onSearchTextChanged,
  onSearch,
  onClear,
  onGetAll,
  onAdd,
}) => {
  const rightPartSizes = (onGetAll) => {
    return onGetAll
      ? {
          md: 8,
          lg: 10,
        }
      : {};
  };

  const leftPartSizes = (onGetAll) => {
    return onGetAll
      ? {
          md: 4,
          lg: 4,
        }
      : {};
  };

  return (
    <>
      <Col xs={24}>
        <Text
          style={{
            paddingBottom: 20,
            paddingRight: 5,
            fontSize: 18,
          }}
          strong
          type="success"
        >
          {title}
        </Text>
      </Col>

      {onGetAll && (
        <Col xs={24} md={12} lg={10}>
          <Search
            placeholder={Words.search_text}
            onSearch={onSearch}
            onChange={onSearchTextChanged}
            value={searchText}
            enterButton
            allowClear
          />
        </Col>
      )}

      <Col xs={12} {...rightPartSizes(onGetAll)}>
        {onGetAll ? (
          <Space>
            <Tooltip title={Words.clear}>
              <Button type="primary" icon={<ReloadIcon />} onClick={onClear} />
            </Tooltip>

            <Tooltip title={Words.view_all}>
              <Button
                type="primary"
                icon={<ViewAllIcon />}
                onClick={onGetAll}
              />
            </Tooltip>
          </Space>
        ) : (
          <Space>
            {onSearch && (
              <Button type="primary" icon={<SearchIcon />} onClick={onSearch}>
                {Words.search}
              </Button>
            )}

            {onClear && (
              <Tooltip title={Words.clear}>
                <Button
                  type="primary"
                  icon={<ReloadIcon />}
                  onClick={onClear}
                />
              </Tooltip>
            )}
          </Space>
        )}
      </Col>

      <Col xs={12} {...leftPartSizes(onGetAll)} className="rowFlex flexEnd">
        {(sheets || onAdd) && (
          <Space>
            {sheets && (
              <ExportExcel
                sheets={sheets}
                fileName={fileName}
                button={
                  <Button type="primary" icon={<DownloadIcon />}>
                    {Words.excel}
                  </Button>
                }
              />
            )}

            {onAdd && (
              <Button type="primary" icon={<PlusIcon />} onClick={onAdd}>
                {Words.new}
              </Button>
            )}
          </Space>
        )}
      </Col>
    </>
  );
};

export default SimpleDataPageHeader;
