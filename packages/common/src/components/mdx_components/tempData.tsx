import BackendAPISchemas from "../../schemas/backendAPI";

export const sessionRawData: BackendAPISchemas.SessionSchema[] = [
  {
    id: "1",
    title: "Seeking the future of Python from the Steering Council",
    description: "",
    image: null,
    isSession: false,
    categories: [],
    speakers: [
      {
        id: "fc2fe85f-8c04-4f8a-885a-82309909f78e",
        nickname: "나동희",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "1",
      room_name: "4142호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 30, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "1",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 9, 50, 0, 0),
      end_at: new Date(2025, 7, 16, 10, 30, 0, 0),
      next_call_for_presentation_schedule: "2",
    },
  },
  {
    id: "2",
    title: "DRF + Pydantic 으로 API 문서화와 Validation 을 한번에 처리하기",
    description: "",
    image: null,
    isSession: true,
    categories: [
      {
        id: "1",
        name: "웹/앱 서비스",
      },
    ],
    speakers: [
      {
        id: "2",
        nickname: "박희찬",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "2",
      room_name: "4142호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 10, 40, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 0, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "2",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 10, 40, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 0, 0, 0),
      next_call_for_presentation_schedule: "3",
    },
  },
  {
    id: "3",
    title: "선 넘지 않는 윤리적인 LLM 솔루션 구축하기!",
    description: "",
    image: null,
    isSession: true,
    categories: [
      {
        id: "2",
        name: "인공지능/데이터 사이언스",
      },
    ],
    speakers: [
      {
        id: "3",
        nickname: "권구민",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "3",
      room_name: "4147호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 10, 40, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 0, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "3",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 10, 40, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 0, 0, 0),
      next_call_for_presentation_schedule: "4",
    },
  },
  {
    id: "4",
    title: '"네? 파이썬을요? 제가요?" 부제: 우당탕탕 개발자로 성장하기(진행중)',
    description: "",
    image: null,
    isSession: true,
    categories: [
      {
        id: "3",
        name: "직업/커리어",
      },
    ],
    speakers: [
      {
        id: "4",
        nickname: "Noa",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "4",
      room_name: "5147호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 10, 40, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 0, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "4",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 10, 40, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 0, 0, 0),
      next_call_for_presentation_schedule: "5",
    },
  },
  {
    id: "5",
    title: "귀찮음을 코드로 해결하는 법",
    description: "",
    image: null,
    isSession: true,
    categories: [
      {
        id: "3",
        name: "직업/커리어",
      },
    ],
    speakers: [
      {
        id: "5",
        nickname: "신나라",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "5",
      room_name: "6144호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 16, 10, 40, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 0, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "5",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 16, 10, 40, 0, 0),
      end_at: new Date(2025, 7, 16, 11, 0, 0, 0),
      next_call_for_presentation_schedule: "6",
    },
  },
  {
    id: "6",
    title: "Django, AI 시대를 위한 가장 실용적인 선택",
    description: "",
    image: null,
    isSession: false,
    categories: [],
    speakers: [
      {
        id: "6",
        nickname: "이진석",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "6",
      room_name: "4142호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 17, 13, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 13, 40, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "6",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 17, 13, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 13, 40, 0, 0),
      next_call_for_presentation_schedule: "7",
    },
  },
  {
    id: "7",
    title: "VLM, 눈 달린 LLM을 만나보자!",
    description: "",
    image: null,
    isSession: true,
    categories: [
      {
        id: "2",
        name: "인공지능/데이터 사이언스",
      },
    ],
    speakers: [
      {
        id: "7",
        nickname: "김대현 B",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "7",
      room_name: "4142호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 17, 14, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 14, 40, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "7",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 17, 14, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 14, 40, 0, 0),
      next_call_for_presentation_schedule: "8",
    },
  },
  {
    id: "8",
    title: "스폰서 세션",
    description: "",
    image: null,
    isSession: true,
    categories: [],
    speakers: [
      {
        id: "8",
        nickname: "당근",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "8",
      room_name: "4147호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 17, 14, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 14, 40, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "8",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 17, 14, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 14, 40, 0, 0),
      next_call_for_presentation_schedule: "9",
    },
  },
  {
    id: "9",
    title: "멀리서 읽는 법",
    description: "",
    image: null,
    isSession: true,
    categories: [
      {
        id: "4",
        name: "일상/사회/교육",
      },
    ],
    speakers: [
      {
        id: "9",
        nickname: "김재윤",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "9",
      room_name: "5147호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 17, 14, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 14, 40, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "9",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 17, 14, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 14, 40, 0, 0),
      next_call_for_presentation_schedule: "10",
    },
  },
  {
    id: "10",
    title: "PySpark Python UDF 2배 빠르게 만들기",
    description: "",
    image: null,
    isSession: true,
    categories: [
      {
        id: "5",
        name: "성능/최적화",
      },
    ],
    speakers: [
      {
        id: "10",
        nickname: "권혁진",
        biography: "",
        image:
          "https://s3.ap-northeast-2.amazonaws.com/pyconkr-backend-prod-public/public/%E1%84%82%E1%85%A1%E1%86%B7%E1%84%92%E1%85%A8%E1%84%85%E1%85%B5%E1%86%B7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXRG76FVYLL4SVCKE%2F20250707%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250707T143106Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEG4aDmFwLW5vcnRoZWFzdC0yIkcwRQIhANnZvGK4hksLniwovDS95OAD%2B17Njkd6Tpi4yFJcolcXAiBi6bnvY41dfqIx%2FOoFvbXGPSWirDIkstjS4JeY6ZSdbiqBAwh3EAQaDDUxODAxMzIwMTc3NiIMUt6TTATzUxD9OyiSKt4CI0Ph0pads9O%2Fa4tKD6vbv2%2FG%2FVTSyqkqQDxtZ56u%2But0NPTDnHpiqmOXmfEWc0nOLs2X44jnhADKMMWocNoeNNahFZcM9A0cZnPhcam%2Fof3hZE%2BvyoLewBVDnMa5JrlHQRoAgeonCie7kyjysKxdOoyTvM9bQwhS124YxuYxoAJ0j%2B5B6WSafvNUBuORy7EP7IoFoEg3vwg%2F7UhecxbPbcEyHZQrkBs4JzsS3LQrn%2BDf32xoXitGMt2H%2Bao7yLFplcmYpgk8tiQbvBrKGHxFYUCpFpDmCbLpao3yHoYNjmY2mrIYOFIEpFCrwpN4z7gHfm%2FPviDdQVJiyAews3svSglGcuykJ4vaHK%2FOB2G5LwTEVXAUB25K%2BMQ92nueca3jDdswkHWuHVuhVBLfGJu5XfSgsBeXPNOXP2uq2BLZj0%2FqmVFHmCXrAQoLDir7d3xz1iGSIZZqffrnLuX%2Ffpcw36evwwY6ngExmRkMV%2BHC8I8eyJ282qr4%2B12nStaqIqgqV0%2FDqPfqMII9wKJesd4DO9aOljfFS%2FXJQ0ZdcPYQ0a9J2TQlh93JcR%2FV54KRviduftojjdu%2BCTHCldC6AlARF5c0URqGlyjbQh2QuDONbOUmN6KY4PXVLfGkSiGKhM%2FHmkHzOkVc5%2FK%2F0SuhdiTFxbCBT0%2Fmr34I5ROLUZhubREbjl9BUQ%3D%3D&X-Amz-Signature=04a6b324d4fc90f23a417406dd9a465858c162c0f4806a531f9b52c5d31d4e2d",
      },
    ],
    room_schedules: {
      id: "10",
      room_name: "6144호",
      event_id: 1,
      event_name: "pycon2025",
      start_at: new Date(2025, 7, 17, 14, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 14, 30, 0, 0),
    },
    call_for_presentation_schedules: {
      id: "10",
      presentation_type_name: "session",
      start_at: new Date(2025, 7, 17, 14, 0, 0, 0),
      end_at: new Date(2025, 7, 17, 14, 30, 0, 0),
      next_call_for_presentation_schedule: "11",
    },
  },
];
