import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

/**
 * 返回页面 url 中，指定键的参数值
 *
 * @param {Array} keys
 * @returns hook
 */
export const useUrlQueryParam = (keys) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();

  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {}),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams]
    ),
    (params) => {
      return setSearchParams(params);
    },
  ];
};

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    });
    setSearchParam(o);
  };
};
/**
 * 判断非空
 *
 * @param {*} value
 */
const isVoid = (value) => value === undefined || value === null || value === "";

/**
 * 返回一个去除空值的干净的对象
 *
 * @param {Object} object
 * @returns
 */
const cleanObject = (object) => {
  if (!object) {
    return {};
  }
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};