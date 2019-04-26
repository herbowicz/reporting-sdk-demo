"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Dashboard = function Dashboard(props) {
  var width = props.width,
      height = props.height,
      color = props.color,
      text = props.text;
  return _react["default"].createElement("div", {
    style: {
      width: width || 600,
      height: height || 300,
      backgroundColor: color || "blue"
    }
  }, _react["default"].createElement("h1", null, "Dashboard boilerplate: ", text));
};

var _default = Dashboard;
exports["default"] = _default;
