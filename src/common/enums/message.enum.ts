export enum BadRequestMessage {
  InvalidLoginData = 'اطلاعات ارسال شده برای احراز هویت صحیح نمی باشد',
  InvalidRegisterData = 'اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد',
  someThingWrong = 'خطایی پیش امده است',
  invalidEmail = 'ایمیل وارد شده صحیح نیست',
  invalidCategory = 'دسته بندی به درستی وارد نشده است',
  AlreadyAccepted = 'قبلا تایید شذه است',
  AlreadyRejected = 'قبلا رد شذه است',
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
  Like = 'پسند شما افزوده شد',
  Dislike = 'پسند شما حذف شد',
  bookmark = 'بوکمارک شد',
  UnBookmark = 'بوکمارک برداشته شد',
}

export enum NotFoundMessage {
  NotFound = 'موردی یافت نشد',
  NotFoundUser = 'کاربری یافت نشد',
  NotFoundPost = 'مقاله ای یافت نشد',
  NotFoundCategory = 'دسته بندی یافت نشد',
  NotFoundComment = 'نظر یافت نشد',
  NotFoundImage = 'تصویر یافت نشد',
}

export enum ValidationMessage {
  InvalidImageFormat = 'فرمت فایل صحیح نیست',
  InvalidEmailFormat = 'فرمت ایمیل اشتباه است',
  InvalidPhoneNumberFormat = 'فرمت شماره موبایل اشتباه است',
}

export enum ConflictMessage {
  CategoryTitle = 'عنوان موجود است',
  Email = 'ایمیل تکراری است',
  Phone = 'شماره موبایل تکراری است',
  Username = 'نام گاربری تکراری است',
}
