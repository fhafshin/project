export enum BadRequestMessage {
  InvalidLoginData = 'اطلاعات ارسال شده برای احراز هویت صحیح نمی باشد',
  InvalidRegisterData = 'اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد',
}

export enum AuthMessage {
  NotFoundMessage = 'یوزی یافت نشد',
  AlReadyExistAccount = 'یوزر موجود است',
  OtpNotExpires = 'زمان کد هنوز منقظی نشده است',
  ExpiredCode = 'کد تایید منقضی شد',
  TryAgain = 'دوباره تلاش کنید',
  LoginAgain = 'مجدا وارد حساب کاربری خود شوید',
  LoginIsRequired = 'لطفا وارد اکانت خود شوید',
}

export enum PublicMessage {
  sendOtp = 'کد ارسال شد',
  LoggedIn = 'با موفقیت وارد حساب کاربری خود شدید',
  Created = 'با موفقیت ایجاد شد',
  Deleted = 'با موفقیت حذف شد',
  Updated = 'با موفقیت به روز رسانی شد',
  Inserted = 'با موفقیت اضافه شد',
}

export enum NotFoundMessage {
  NotFound = 'موردی یافت نشد',
  NotFoundUser = 'کاربری یافت نشد',
  NotFoundPost = 'مقاله ای یافت نشد',
  NotFoundCategory = 'دسته بندی یافت نشد',
}

export enum ValidationMessage {}

export enum ConflictMessage {
  CategoryTitle = 'عنوان موجود است',
}
