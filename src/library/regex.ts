export class Regex {
  public isUserId(value: string): boolean {
    return new RegExp(/^[a-z0-9_-]{3,32}$/g).test(value);
  }
  public isEmail(value: string): boolean {
    return new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(value);
  }
  public isPassword(value: string): boolean {
    return new RegExp(
      /^(?=.*[A-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+{}|;':"<>,./?])[a-zA-Z0-9~!@#$%^&*()_+{}|;':"<>,./?]{5,40}$/g,
    ).test(value);
  }
}
