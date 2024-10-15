import { POST } from 'src/constant';

const { maxTitleLength, maxTextLength } = POST;

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
