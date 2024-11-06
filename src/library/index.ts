import { PostRules } from 'src/constant';

const { maxTitleLength, maxTextLength } = PostRules;

export class Utility {
  public isValidPost(title: string, text: string): boolean {
    if (
      !title ||
      !text ||
      title.length > maxTitleLength ||
      text.length > maxTextLength
    ) {
      return false;
    } else {
      return true;
    }
  }
}
