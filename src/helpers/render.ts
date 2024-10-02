import { EXE_SPLIT, KEY_SPLIT } from "../configs";

// render giao dịch
export const renderStrongColor = (str: string | number) =>
  `<b class="text-entity-link">${str}</b>`;

// end render giao dịch

// render phân trang telegram
export const renderKey = (arr: (string | number)[]) =>
  arr?.filter((item) => !!item)?.join(KEY_SPLIT);

// render default format
export const renderDefaultFormat = (arr: string[][], splitStr = EXE_SPLIT) => {
  let str = `Định dạng hỗ trợ:\n`;

  return `${str}${arr
    .map((items) => {
      return `+ ${renderStrongColor(items.join(splitStr))}\n`;
    })
    .join("")}`;
};
