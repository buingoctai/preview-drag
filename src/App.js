import React from "react";

import ImageGrid from "./components/ImageGrid";
import DataList from "./components/DataList";

import EXAMPLE_IMAGES from "./data";

const EXAMPLE_DATA = EXAMPLE_IMAGES.slice(10).map((img, index) => ({
  thumb: img.url,
  title: `Title ${index}`,
  sub: `Sub ${index}`,
}));

// const EXAMPLE_DATA = [
//   {
//     sub: "Sub 0",
//     thumb:
//       "https://images.unsplash.com/photo-1557840033-30aa5e6ce252?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     title: "Title 0",
//   },
//   {
//     sub: "Sub 1",
//     thumb:
//       "https://images.unsplash.com/photo-1591319619277-2103a926bf06?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     title: "Title 1",
//   },
// ];

function App(props) {
  function handleIndexUpdate(oldIndex, newIndex) {
    console.log("handleIndexUpdate", oldIndex, newIndex);
  }

  const ROW_WIDTH = 800;
  const MARGIN = 4;
  return (
    <div className="flex column align-center justify-center">
      <div
        style={{ width: ROW_WIDTH, display: "flex", flexDirection: "column" }}
      >
        <ImageGrid
          displayStyle="grid"
          className="list__image__container"
          subClassName="img__wrap"
          dataList={EXAMPLE_IMAGES}
          margin={MARGIN}
          imageSize={80}
          numItemRow={Math.floor(ROW_WIDTH / (80 + 2 * MARGIN))}
          handleIndexUpdate={handleIndexUpdate}
        />
        <DataList
          displayStyle="list"
          className="list__data__container"
          subClassName="item__wrap"
          dataList={EXAMPLE_DATA}
          margin={MARGIN}
          imageSize={40}
          handleIndexUpdate={handleIndexUpdate}
        />
        <div style={{ width: "800px", height: "200px" }} draggable="true" />
      </div>
    </div>
  );
}

export default App;
