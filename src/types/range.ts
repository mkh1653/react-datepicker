export type DateRange<T> = {
  start: T;
  end: T;
};

export type PartialDateRange<T> =
  | {
      start: null;
      end: null;
    }
  | {
      start: T;
      end: null;
    }
  | DateRange<T>;
