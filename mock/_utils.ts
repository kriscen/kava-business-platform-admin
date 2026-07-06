export function ok<T>(data: T) {
  return {
    success: true,
    data,
    errorCode: null,
    errorMessage: null,
  }
}

export function okVoid() {
  return ok(null)
}

export function fail(errorCode: string | number, errorMessage: string) {
  return {
    success: false,
    data: null,
    errorCode: String(errorCode),
    errorMessage,
  }
}

export function page<T>(list: T[], total: number, pageNo: number, pageSize: number) {
  return {
    list,
    total,
    pageNo,
    pageSize,
  }
}
