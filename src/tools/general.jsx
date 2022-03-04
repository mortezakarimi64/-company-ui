import Words from "../resources/words";

export const getFormItemLayout = (labelCol) => {
  return {
    labelCol: {
      xs: { span: 24 },
      sm: { span: labelCol },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 - labelCol },
    },
  };
};

export const centerTextCol = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const windowSize = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const isMobileView = (screenHook) => {
  const breakoints = screenHook(windowSize);

  return breakoints.xs;
};

export const getGenderTitle = (genderID) => {
  return genderID === 1 ? Words.male : Words.female;
};
