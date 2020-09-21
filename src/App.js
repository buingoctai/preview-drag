import React from "react";

import ImageGrid from "./components/ImageGrid";
import DataList from "./components/DataList";
import {
  ROW_WIDTH,
  SPACE,
  WIDTH_ITEM_GRID,
  HEIGHT_ITEM_GRID,
  WIDTH_ITEM_LIST,
  HEIGHT_ITEM_LIST,
  IMAGE_SIZE,
} from "./utils/constants";

import EXAMPLE_IMAGES from "./data";

const EXAMPLE_DATA = EXAMPLE_IMAGES.map((img, index) => ({
  thumb: img.url,
  title: `Title ${index}`,
  sub: `Sub ${index}`,
}));

function App(props) {
  // function handleIndexUpdate(oldIndex, newIndex) {
  //   console.log("handleIndexUpdate", oldIndex, newIndex);
  // }
  function handleIndexUpdate(orderList) {
    console.log("handleIndexUpdate", orderList);
  }

  return (
    <div className="flex column align-center justify-center">
      <ImageGrid
        dataList={EXAMPLE_IMAGES}
        itemSize={{ width: WIDTH_ITEM_GRID, height: HEIGHT_ITEM_GRID }}
        icon={{
          width: WIDTH_ITEM_GRID,
          height: HEIGHT_ITEM_GRID,
          imgField: "url",
        }}
        rowWidth={ROW_WIDTH}
        space={SPACE}
        handleIndexUpdate={handleIndexUpdate}
      />
      <DataList
        dataList={EXAMPLE_DATA}
        itemSize={{
          width: WIDTH_ITEM_LIST,
          height: HEIGHT_ITEM_LIST,
        }}
        // icon={{ ...IMAGE_SIZE, imgField: "thumb" }}
        rowWidth={ROW_WIDTH}
        space={SPACE}
        handleIndexUpdate={handleIndexUpdate}
      />
      {/* <div
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598113082891-dcb7b2032b28?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
            url('https://images.unsplash.com/photo-1598147853558-b53f7f671c0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
            url('https://images.unsplash.com/photo-1573188100983-5274141e9135?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60')
            `,
          backgroundPosition:
            "left 16px top 16px, left 8px top 8px, left 0px top 0px",
          backgroundRepeat: "no-repeat,no-repeat,no-repeat",
          backgroundSize: "65px 55px,65px 55px,65px 55px",
          width: "81px",
          height: "71px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "64px",
            height: "54px",
            display: "flex",
            top: "16px",
            left: "16px",
            border: "1px solid yellow",

            borderStyle: "dotted",
          }}
        >
          <span>8</span>
        </div>
        <div
          style={{
            position: "absolute",
            width: "64px",
            height: "54px",
            display: "flex",
            top: "8px",
            left: "8px",
            border: "1px solid yellow",
            borderBottom: "0px",
            borderRight: "0px",
            borderStyle: "dotted",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "64px",
            height: "54px",
            display: "flex",
            top: "0px",
            left: "0px",
            border: "1px solid yellow",
            borderBottom: "0px",
            borderRight: "0px",
            borderStyle: "dotted",
          }}
        />
      </div> */}
    </div>
  );
}

export default App;
