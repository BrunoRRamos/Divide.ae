import type { ComponentType } from "react";
import React, { Suspense } from "react";

import { Loading } from "./Loading";

export const withSuspenseBoundary = (
  Component: ComponentType<object>,
  fallback = <Loading screen />,
) => {
  return function withSuspense() {
    return (
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    );
  };
};
