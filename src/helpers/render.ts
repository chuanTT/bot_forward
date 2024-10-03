import { chunk } from "lodash";
import { EXE_SPLIT, KEY_SPLIT } from "../configs";
import { Group } from "../entity/Group";
import { ID_DB } from "../types";
import { Source } from "../entity/Source";
import { Target } from "../entity/Target";

// render giao dịch
export const renderStrongColor = (str: string | number) =>
  `<b class="text-entity-link">${str}</b>`;

export const renderCode = (str: ID_DB) => `<code>${str}</code>`;

// end render
export const renderGroup = (group: Group) =>
  `${renderCode(group?.groupId)} - ${group?.name}`;

export const renderGroups = (groups: Group[]) =>
  groups?.map((group) => renderGroup(group))?.join("\n");

export const renderGroupsChunk = (groups: Group[], isFist?: boolean) => {
  const newGroups = chunk(groups, 25);
  return newGroups?.map((items, index) =>
    `${index === 0 && isFist ? "Danh sách nhóm:\n" : " "}${renderGroups(
      items
    )}`.trim()
  );
};

export const renderGroupsRelations = (items: (Source | Target)[]) =>
  items?.map((item) => renderGroup(item?.group))?.join("\n");

export const renderGroupsRelationsChunk = (results: (Source | Target)[], isFist?: boolean, strFist = "Danh sách nhóm nguồn") => {
  const newResults = chunk(results, 25);
  return newResults?.map((items, index) =>
    `${index === 0 && isFist ? `${strFist}:\n` : " "}${renderGroupsRelations(
      items
    )}`.trim()
  );
};


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
