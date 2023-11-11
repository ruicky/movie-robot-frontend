import React, { useState } from "react";
import styled from "styled-components/macro";
import DropDownBox from "@/components/DropDownBox";
import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import classnames from "classnames";

export const TagFileter = ({ filter, data, onFilter }) => {
  let list = [
    { name: "站点", dataKey: "sites" },
    { name: "年份", dataKey: "movie_release_year" },
    { name: "来源", dataKey: "source" },
    { name: "分辨率", dataKey: "resolution" },
    { name: "编码", dataKey: "encode" },
    { name: "压制组", dataKey: "releaseTeam" },
    { name: "促销", dataKey: "promotion" },
  ];
  if ("season" in data) {
    list.push({ name: "季度", dataKey: "season" });
  }
  if ("episode" in data) {
    list.push({ name: "集数", dataKey: "episode" });
  }
  const obj2Array = (obj) => {
    const arr = Object.keys(obj)
      .map((key) => ({ name: key, value: obj[key] }))
      .sort((a, b) => {
        if (a.name === "全部") {
          return -1;
        }
        if (b.name === "全部") {
          return 1;
        }
        return a.value - b.value;
      });
    return arr;
  };
  const FilterWrapper = styled(Box)`
    position: sticky;
    top: 56px;

    ${(props) => props.theme.breakpoints.up("sm")} {
      top: 64px;
    }

    z-index: 100;
    overflow-x: scroll;
    -webkit-overflow =
    scroling: touch;
    background: ${(props) => props.theme.palette.background.default};

    &::-webkit-scrollbar {
      display: none
    }
  `;

  const [showDrawer, setShowDrawer] = useState(false);
  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <FilterWrapper
      sx={{
        my: 2,
      }}
    >
      <div className="tw-hidden md:tw-flex">
        {list.map((item) => {
          return (
            <DropDownBox
              key={item.dataKey}
              label={item.name}
              sx={{ minWidth: "80px" }}
              value={Object.keys(data[item.dataKey]).find(
                (value) => data[item.dataKey][value] === filter[item.dataKey]
              )}
              data={obj2Array(data[item.dataKey])}
              onChange={(value) => {
                onFilter({ ...filter, [item.dataKey]: value });
              }}
            />
          );
        })}
      </div>
      <div className="md:tw-hidden tw-flex tw-justify-start">
        <div onClick={toggleDrawer}>
          <div className="tw-p-2 tw-flex tw-items-center tw-justify-center tw-cursor-pointer">筛选</div>
        </div>
        <Drawer
          container={document.getElementById("root")}
          anchor="right"
          open={showDrawer}
          onClose={toggleDrawer}
          PaperProps={{
            className: "tw-bg-[#15161A] tw-w-[85vw] tw-text-white",
          }}
        >
          <div className="tw-py-4 tw-flex-col">
            <div className="tw-px-4 tw-pb-4 tw-text-start tw-text-lg tw-font-bold tw-p-2">
              全部筛选
            </div>
            <div className="tw-px-4">
              {list.map((item) => {
                return (
                  <div className="tw-mb-3" key={item.dataKey}>
                    <div className="">{item.name}</div>
                    <div className="tw-pt-2 tw-grid tw-grid-cols-4 tw-gap-2">
                      {obj2Array(data[item.dataKey]).map((value) => {
                        const selected =
                          filter[item.dataKey] === value.value ||
                          ((!filter[item.dataKey] || filter[item.dataKey] === "全部") &&
                            value.name === "全部");
                        return (
                          <div
                            key={value.value}
                            className={classnames(
                              "tw-bg-[#1D2027] tw-p-1 tw-rounded-md tw-text-center tw-cursor-pointer",
                              {
                                "tw-text-[#269649]": selected,
                              }
                            )}
                            onClick={() => {
                              onFilter({ ...filter, [item.dataKey]: value.value });
                            }}
                          >
                            {value.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Drawer>
      </div>
    </FilterWrapper>
  );
};
