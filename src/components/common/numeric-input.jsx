import React, { Component } from "react";
import { Input } from "antd";

const formatNumber = (value) => {
  value += "";
  const list = value.split(".");
  const prefix = list[0].charAt(0) === "-" ? "-" : "";
  let num = prefix ? list[0].slice(1) : list[0];
  let result = "";

  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }

  if (num) {
    result = num + result;
  }

  return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
};

class NumericInput extends Component {
  onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
      this.props.onChange(value);
    }
  };

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    let valueTemp = value;
    if (value.charAt(value.length - 1) === "." || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, "$1"));
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value, ...rest } = this.props;
    const title = value ? (
      <span className="numeric-input-title">
        {value !== "-" ? formatNumber(value) : "-"}
      </span>
    ) : (
      "Input a number"
    );
    return (
      <Input
        value={value}
        onChange={this.onChange}
        onBlur={this.onBlur}
        {...rest}
      />
    );
  }
}

export default NumericInput;
