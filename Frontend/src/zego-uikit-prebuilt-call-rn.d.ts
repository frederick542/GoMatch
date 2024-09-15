declare module '@zegocloud/zego-uikit-prebuilt-call-rn' {
  import { ComponentType } from 'react';

  interface ZegoUIKitPrebuiltCallProps {
    config: any;
    appID: number;
    appSign: string;
    userID: string;
    userName: string;
    callID: string;
  }

  export const ZegoUIKitPrebuiltCall: ComponentType<ZegoUIKitPrebuiltCallProps>;

  export const ONE_ON_ONE_VIDEO_CALL_CONFIG: any;
  export const ZegoMenuBarButtonName;
}
