import React from "react";
import enhance from "./enhance";

import ImageGrid from "./components/ImageGrid";
import DataList from "./components/DataList";

function App(props) {
  const { images, exampleData } = props;
  return (
    <div className="flex column align-center justify-center">
      <div style={{ width: 800 }}>
        <ImageGrid images={images} />
        <DataList data={exampleData} />
      </div>
    </div>
  );
}

export default enhance(App);
