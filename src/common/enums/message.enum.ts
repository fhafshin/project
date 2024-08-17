export enum BadRequestMessage {
  InvalidLoginData = 'اطلاعات ارسال شده برای احراز هویت صحیح نمی باشد',
  InvalidRegisterData = 'اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد',
}

export enum AuthMessage {
  NotFoundMessage = 'یوزی یافت نشد',
  AlReadyExistAccount = 'یوزر موجود است',
  OtpNotExpires = 'زمان کد هنوز منقظی نشده است',
}

export enum NotFoundMessage {}

export enum ValidationMessage {}
