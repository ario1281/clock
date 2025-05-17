// https://github.com/ryo-ma/github-profile-trophy/blob/master/src/utils.ts

export class CustomURLSearchParams extends URLSearchParams {
  getString(key, defaultValue = "") {
    return super.get(key)?.toString() ?? defaultValue;
  }
  getNumber(key, defaultValue = 0) {
    const parsedValue = parseInt(this.getString(key));
    return !isNaN(parsedValue) ? parsedValue : defaultValue;
  }
  getBoolean(key, defaultValue = false) {
    const param = this.getString(key);
    return param === "true" ? true : param === "false" ? false : defaultValue;
  }
}
