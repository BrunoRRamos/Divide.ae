import { Suspense, useState } from "react";
import { View } from "react-native";
import OTPTextInput from "react-native-otp-textinput";
import toast from "react-native-toast-message";
import { router } from "expo-router";

import { Loading } from "~/components/layout/Loading";
import { Text } from "~/components/ui";
import { api } from "~/utils/api";

function GroupCode() {
  const [loading, setLoading] = useState(false);

  const { mutateAsync: mutate } = api.group.update.addUser.useMutation();

  const onCodeFilled = async (code: string) => {
    console.log(code);

    if (code.length < 6) {
      return;
    }

    setLoading(true);

    await mutate(code)
      .then((data) => {
        router.replace({
          pathname: "/group/[id]",
          params: {
            id: data.id,
          },
        });
      })
      .catch((error) => {
        const err = error as unknown as { message: string | undefined };
        toast.show({
          type: "error",
          text1: err.message ?? "Something went wrong",
        });
      });

    setLoading(false);
  };

  return (
    <View className="h-screen flex-col items-center justify-center gap-16 bg-white">
      <Text className="text-3xl font-semibold">Group code</Text>
      {loading ? (
        <Loading />
      ) : (
        <OTPTextInput
          autoFocus
          offTintColor="black"
          tintColor="#f9d948"
          inputCount={6}
          handleTextChange={onCodeFilled}
        />
      )}
    </View>
  );
}

export default () => (
  <Suspense fallback={<Loading screen />}>
    <GroupCode />
  </Suspense>
);
