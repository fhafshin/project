import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import * as queryString from 'qs';
import { SmsTemplate } from './enum/sms-template.enum';
@Injectable()
export class KavenegarService {
  constructor(private httpService: HttpService) {}

  async sendVerificationSms(receptor: string, token: string) {
    console.log(token, receptor);
    const params = queryString.stringify({
      receptor,
      token,
      template: SmsTemplate.Verify,
    });
    console.log(params);
    const { SEND_SMS_URl } = process.env;
    const result = await lastValueFrom(
      this.httpService
        .get(`${SEND_SMS_URl}?${params}`)
        .pipe(map((res) => res.data))
        .pipe(
          catchError((err) => {
            console.log(err);
            throw new InternalServerErrorException('kavenegar');
          }),
        ),
    );

    console.log(result);
    return result;
  }
}
