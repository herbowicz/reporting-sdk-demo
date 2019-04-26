# reporting-sdk-demo

![GitHub package.json version](https://img.shields.io/github/package-json/v/herbowicz/reporting-sdk-demo.svg)
![npm (tag)](https://img.shields.io/npm/v/reporting-sdk-demo/latest.svg)
[![install size](https://packagephobia.now.sh/badge?p=reporting-sdk-demo)](https://packagephobia.now.sh/result?p=reporting-sdk-demo)

Reporting SDK Demo as NPM package

## Install

```
$ npm i -S reporting-sdk-demo
```

## Usage

Import Dashboard component where you want to use it:

```js
import Dashboard from "reporting-sdk-demo";
```

Then just render it:

```js
<Dashboard />
```

## Props

| _Prop_ |     _Description_     | _Default value_ |
| ------ | :-------------------: | :-------------: |
| color  | Sets background color |      blue       |
| width  |      Sets width       |       100       |
| height |      Sets height      |       100       |
| text   |    Sets inner text    |  empty string   |

## Example

```
import React, { Component } from "react";
import Dashboard from "reporting-sdk-demo";

class App extends Component {
  render() {
    return (
        <Dashboard height={150} color="red" text="Hello World!" />
    );
  }
}

export default App;
```
