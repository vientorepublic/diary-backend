export const BrandName = '글귀저장소';

export enum Korean {
  USER_NOT_FOUND = '해당 사용자를 찾을 수 없습니다.',
  USER_DATA_NOT_FOUND = '사용자 정보를 찾을 수 없습니다.',
  ID_OR_PASSWORD_MISMATCH = '아이디 또는 비밀번호가 일치하지 않습니다.',
  RECAPTCHA_VERIFICATION_FAILED = 'reCAPTCHA 토큰 검증에 실패했습니다.',
  INVALID_POST_FORMAT = '게시글 형식이 잘못되었습니다.',
  POST_PUBLISHED = '게시 완료!',
  POST_EDITED = '게시글이 수정되었습니다.',
  POST_DELETED = '게시글이 삭제 되었습니다.',
  NO_PUBLISHED_POSTS = '등록된 게시글이 없습니다.',
  POST_NOT_FOUND = '해당 게시글을 찾을 수 없습니다.',
  NO_POST_READ_PERMISSION = '해당 게시글에 접근할 수 있는 권한이 없습니다.',
  NO_POST_EDIT_PERMISSION = '해당 게시글을 수정할 수 있는 권한이 없습니다.',
  NO_POST_DELETE_PERMISSION = '해당 게시글을 삭제할 수 있는 권한이 없습니다.',
  POST_PUBLISHER_NOT_FOUND = '해당 게시글의 사용자를 찾을 수 없습니다.',
  DRAFT_SAVED = '초안이 저장되었습니다.',
  NO_SAVED_DRAFT = '저장된 초안이 없습니다.',
  DRAFT_DELETED = '초안이 삭제되었습니다.',
  VERIFY_LINK_EXPIRED = '인증 링크가 만료되었습니다.',
  WELCOME_USER = '환영합니다, {user}님!',
  ACCOUNT_ACTIVATED = '계정 활성화가 완료되었습니다.',
  INVALID_ID_FORMAT = '아이디 형식이 일치하지 않습니다.',
  INVALID_EMAIL_FORMAT = '이메일 주소 형식이 일치하지 않습니다.',
  INVALID_PASSWORD_FORMAT = '비밀번호 형식이 일치하지 않습니다.',
  ID_ALREADY_IN_USE = '해당 아이디는 이미 사용중입니다.',
  EMAIL_ALREADY_IN_USE = '해당 이메일 주소는 이미 사용중입니다.',
  ACCOUNT_REGISTERED = '가입이 완료되었습니다.',
  NO_SEARCH_RESULT = '검색 결과가 없습니다.',
}

export enum VerifyEmailLocale {
  SUBJECT = `[${BrandName}] 계정 이메일 인증`,
  TITLE = '계정 이메일 인증',
  USERNAME = '안녕하세요, {user}님.',
  TEXT_01 = '이메일 인증을 완료하려면 아래 링크를 열어주세요.',
  TEXT_02 = '이메일 인증을 요청하지 않으셨다면, 본 이메일을 무시해 주세요.',
  TEXT_03 = '인증 링크는 한국 표준시 기준 {date}에 만료됩니다.',
}
