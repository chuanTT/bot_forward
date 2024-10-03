import { MAX_TAKE, TAKE } from "../configs";
import { calculatorLastPage } from "./functions";

export interface TakeAndSkip {
  skip?: number;
  take?: number;
}

interface paginationFuncParameter<T> extends TakeAndSkip {
  callBack: (obj: Required<TakeAndSkip>) => Promise<[T[], number]>;
}

interface paginationFuncReturn<T> extends Required<TakeAndSkip> {
  data: T[];
  total: number;
  lastPage: number;
}

export const paginationFunc = async <T>({
  skip = 1,
  take = TAKE,
  callBack,
}: paginationFuncParameter<T>): Promise<paginationFuncReturn<T>> => {
  skip <= 0 && (skip = 1);
  take > MAX_TAKE && (take = MAX_TAKE);
  const skipQuery = (skip - 1) * take;
  const [data, total] = await callBack({ skip: skipQuery, take });

  return {
    data,
    skip,
    take,
    total,
    lastPage: calculatorLastPage(total, take),
  };
};
