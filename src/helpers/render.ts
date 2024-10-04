import { chunk } from "lodash";
import {
  CONFIRM_CLEAR,
  EXE_SPLIT,
  ICommandItem,
  KEY_SPLIT,
  MAX_TAKE,
} from "../configs";
import { Group } from "../entity/Group";
import {
  EnumCommand,
  ICommandItemRetrunExecution,
  ID_DB,
  IMessage,
  SourceTargetType,
} from "../types";
import { SourceTarget } from "../entity/SourceTarget";
import groupService from "../services/group.service";
import sourcetargetService from "../services/sourcetarget.service";
import { joinKeyCommand } from "./telegram";
import { checkNumberGroup } from "./functions";

export const strSource = "nguồn";
export const strTarget = "nhận chuyển tiếp";

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

export const renderGroupsRelations = (items: SourceTarget[]) =>
  items?.map((item) => renderGroup(item?.group))?.join("\n");

export const renderGroupsRelationsChunk = (
  results: SourceTarget[],
  isFist?: boolean,
  strFist = `Danh sách nhóm ${strSource}`
) => {
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

export const renderSourceTarget = async (strView = strSource) => {
  const { data } = await groupService.findAllPagination({});
  return [
    `Nhập nhóm muốn làm ${strView}. Các nhóm cách nhau "${EXE_SPLIT}"\n\nLưu ý: ${renderStrongColor(
      `Danh sách nhóm ${strView} tối đa có thể hỗ trợ ${MAX_TAKE} nhóm`
    )}`,
    ...(data && data?.length > 0
      ? renderGroupsChunk(data, true)
      : ["Bot chưa tham gia nhóm nào"]),
  ];
};

export const renderSTGroupsRelations = async (
  userId: ID_DB,
  type = SourceTargetType.SOURCE
) => {
  const results = await sourcetargetService.findBy(userId, type);
  const newStr = type === SourceTargetType.SOURCE ? strSource : strTarget;
  return results && results?.length > 0
    ? renderGroupsRelationsChunk(results, true, `Danh sách nhóm ${newStr}`)
    : `Chưa có danh sách ${newStr} nào.`;
};

export const renderSetSourceTarget = async (
  text?: string,
  msg?: IMessage,
  type = SourceTargetType.SOURCE
): Promise<ICommandItemRetrunExecution> => {
  const isVaild = checkNumberGroup(text);
  if (!isVaild)
    return {
      data: `Danh sánh id nhóm không đúng định dạng`,
      error: true,
    };
  const arrGroupIds = text?.split(EXE_SPLIT);
  const userId = msg.from.id;
  const newStr = type === SourceTargetType.SOURCE ? strSource : strTarget;

  const maxCountSource = await sourcetargetService.countBy(userId, type);
  if (maxCountSource >= MAX_TAKE)
    return {
      data: [
        `Bot đã vượt quá ${renderStrongColor(
          MAX_TAKE
        )} nhóm cho phép làm danh sách ${newStr}`,
      ],
      error: true,
    };
  const data = await sourcetargetService.insert(
    arrGroupIds,
    userId,
    type,
    maxCountSource
  );
  const error = !data || (data && data?.length <= 0);
  const msgChat = error
    ? `Bot có thể không được tham gia vào nhóm hoặc đã có trong danh sách ${newStr}.`
    : `Thêm danh sách nhóm thành công.`;

  return {
    data: msgChat,
    error,
  };
};

export const renderCommandClearAll = (
  type = SourceTargetType.SOURCE
): ICommandItem => {
  const newStr = type === SourceTargetType.SOURCE ? strSource : strTarget;

  return {
    describe: `Xoá tất cả danh sách nhóm ${newStr}`,
    render: async () =>
      `Bạn có chắc chắn muốn xóa toàn bộ nhóm ${newStr} không?\n\nGửi '${CONFIRM_CLEAR}' để xác nhận bạn thực sự muốn xóa.`,
    execution: async (text, msg) => {
      const isConfirm = text?.trim() === CONFIRM_CLEAR;
      if (!isConfirm) {
        return {
          data: `Vui lòng nhập văn bản xác nhận chính xác như thế này:\n${CONFIRM_CLEAR}\n\nGõ ${joinKeyCommand(
            EnumCommand.cancel
          )} để hủy thao tác.`,
          error: false,
        };
      }
      await sourcetargetService.clearAll(msg?.from?.id, type);
      return {
        data: `Xóa danh sách nhóm ${newStr} thành công.`,
      };
    },
  };
};

export const renderCommandClearOne = (
  type = SourceTargetType.SOURCE
): ICommandItem => {
  const newStr = type === SourceTargetType.SOURCE ? strSource : strTarget;
  return {
    describe: `Xóa danh sách nhóm ${newStr} theo id nhóm`,
    render: async (msg) => {
      const results = await renderSTGroupsRelations(msg?.from?.id, type);
      return [
        "Gửi nhóm cần xóa",
        ...(Array.isArray(results) ? results : [results]),
      ];
    },
    execution: async (text, msg) => {
      const userId = msg?.from?.id;
      const result = await sourcetargetService.clearOne(userId, text, type);
      if (!result)
        return {
          data: "Không tồn tại",
          error: true,
        };
      return { data: `Xóa danh sách nhóm ${newStr}.` };
    },
  };
};
