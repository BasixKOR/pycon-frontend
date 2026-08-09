import { NotificationChannelValue } from "@frontend/common/schemas/backendAdminAPI";

// 알림 채널별 admin 라우트 설정. 라우트 컨벤션(<app>/<model_name>)에 따라 app 은 모두 "notification",
// resource 는 채널·종류별 모델명을 사용한다.
export type NotificationChannelKind = "email" | "kakao" | "sms";

export type NotificationChannel = {
  app: string;
  kind: NotificationChannelKind;
  label: string;
  // 백엔드 API 가 body 로 받는 채널 식별자 (notification.channels.NotificationChannel).
  value: NotificationChannelValue;
  templateResource: string;
  historyResource: string;
};

export const EMAIL_CHANNEL: NotificationChannel = {
  app: "notification",
  kind: "email",
  label: "이메일",
  value: "email",
  templateResource: "emailnotificationtemplate",
  historyResource: "emailnotificationhistory",
};

export const KAKAO_CHANNEL: NotificationChannel = {
  app: "notification",
  kind: "kakao",
  label: "카카오 알림톡",
  value: "nhn_cloud_kakao_alimtalk",
  templateResource: "nhncloudkakaoalimtalknotificationtemplate",
  historyResource: "nhncloudkakaoalimtalknotificationhistory",
};

export const SMS_CHANNEL: NotificationChannel = {
  app: "notification",
  kind: "sms",
  label: "SMS",
  value: "nhn_cloud_sms",
  templateResource: "nhncloudsmsnotificationtemplate",
  historyResource: "nhncloudsmsnotificationhistory",
};

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [EMAIL_CHANNEL, SMS_CHANNEL, KAKAO_CHANNEL];

export const CHANNEL_BY_VALUE: Record<NotificationChannelValue, NotificationChannel> = {
  email: EMAIL_CHANNEL,
  nhn_cloud_sms: SMS_CHANNEL,
  nhn_cloud_kakao_alimtalk: KAKAO_CHANNEL,
};
