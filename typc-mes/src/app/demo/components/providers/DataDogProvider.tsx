"use client";

import { datadogRum } from "@datadog/browser-rum";
import { useEffect } from "react";

export default function DataDogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // const currentUrl = window?.location.href;
    // if (0 <= currentUrl.indexOf(DOMAIN_URL)) {
    //   console.log('ddog-m365');
    //   datadogRum.init({
    //     applicationId: '0ced7a61-6537-4e51-9155-e6f7fc408b58',
    //     clientToken: 'pubbc6e14e52cd8487cc55322424143a00a',
    //     site: 'us3.datadoghq.com',
    //     service: 'lca-esg',
    //     env: 'service',
    //     sessionSampleRate: 100,
    //     sessionReplaySampleRate: 20,
    //     trackUserInteractions: true,
    //     trackResources: true,
    //     trackLongTasks: true,
    //     useCrossSiteSessionCookie: true,
    //     defaultPrivacyLevel: 'allow',
    //   });
    //   datadogRum.startSessionReplayRecording();
    // } else if (0 <= currentUrl.indexOf('https://dev.machine365.ai')) {
    if (process.env.NODE_ENV !== "development") {
      console.log("lca-esg-dev");
      datadogRum.init({
        applicationId: "0ced7a61-6537-4e51-9155-e6f7fc408b58",
        clientToken: "pubbc6e14e52cd8487cc55322424143a00a",
        site: "us3.datadoghq.com",
        service: "lca-esg-dev",
        env: "dev",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: "allow",
      });
      datadogRum.startSessionReplayRecording();
    }
    // }
  }, []);

  //   if (session.status === 'authenticated') {
  //     datadogRum.setUser({
  //       id: session.data.user.result.userId,
  //       name: session.data.user.result.userName,
  //       email: session.data.user.result.email,
  //     });
  //   }

  return <>{children}</>;
}
