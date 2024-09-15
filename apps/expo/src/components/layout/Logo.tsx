import type { VariantProps } from "class-variance-authority";
import type { SvgProps } from "react-native-svg";
import { Text, View } from "react-native";
import { Line, Path, Svg } from "react-native-svg";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

const logoVariants = cva("", {
  variants: {
    size: {
      sm: "size-9",
      md: "size-16",
      lg: "size-18",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export function Logo({
  size,
  className,
  ...props
}: SvgProps & VariantProps<typeof logoVariants>) {
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-center gap-4",
        className,
      )}
      {...props}
    >
      <View className={cn(logoVariants({ size }))}>
        <Svg viewBox="0 0 38 36" fill="none">
          <Path
            d="M1 24C9.16503 16.0577 17.3611 26.5978 12.5 34.5C12.5 34.5 28.9943 10.9584 37 1L16 14.5L1 24Z"
            stroke="#FAD928"
          />
          <Line
            x1="11.6707"
            y1="23.6237"
            x2="35.6707"
            y2="2.62371"
            stroke="#FAD928"
          />
          <Line
            x1="15.4743"
            y1="29.8419"
            x2="17.4743"
            y2="35.8419"
            stroke="#FAD928"
          />
          <Line
            x1="17.576"
            y1="35.735"
            x2="27.576"
            y2="19.735"
            stroke="#FAD928"
          />
          <Line
            x1="27.5097"
            y1="20.0981"
            x2="26.5097"
            y2="15.0981"
            stroke="#FAD928"
          />
        </Svg>
      </View>
      <Text className="text-5xl text-foreground">Divide.ae</Text>
    </View>
  );
}
