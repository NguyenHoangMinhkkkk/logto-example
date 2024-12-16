import { Button, Text, View } from "react-native";

import {
  LogtoConfig,
  LogtoProvider,
  Prompt,
  ReservedScope,
  useLogto,
  UserScope,
} from "@logto/rn";
import { useEffect, useState } from "react";

const logtoConfig: LogtoConfig = {
  appId: "lx2l0yq69d9q9p8u4xtbt",
  endpoint: "https://qa-logto.ilotusland.asia/",
  resources: ["https://qa-x.ilotusland.asia/api/config/v1"],
  scopes: [
    UserScope.CustomData,
    UserScope.Email,
    UserScope.Identities,
    UserScope.OrganizationRoles,
    UserScope.Organizations,
    UserScope.Phone,
    UserScope.Profile,
    UserScope.Roles,
    ReservedScope.OfflineAccess,
    ReservedScope.OpenId,
  ],
  prompt: Prompt.Login,
  includeReservedScopes: false,
};

const Content = () => {
  const {
    signIn,
    signOut,
    getAccessToken,
    isAuthenticated,
    getIdTokenClaims,
    getRefreshToken,
  } = useLogto();
  const [user, setUser] = useState(null);
  const [at, setAT] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        getAccessToken().then((accessToken) => {
          setAT(accessToken);
        });
        getIdTokenClaims().then((claims) => {
          setUser(claims);
        });
        getRefreshToken().then((rfToken) => {
          console.log("==========rfToken-rfToken=======", rfToken);
        });
      } catch (error) {
        console.log("==========error=======", error);
      }
    }
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <View>
      <Text>{`AccessToken: ${JSON.stringify(at, undefined, 2)}`}</Text>
      <Text>{`\n--------------------------\n`}</Text>
      <Text>{`User Info: ${JSON.stringify(user, undefined, 2)}`}</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  ) : (
    <Button
      title="Sign In"
      onPress={async () =>
        signIn({
          redirectUri: "io.logto://callback",
          loginHint: "minh@ill.com",
          prompt: Prompt.Login,
        }).catch((err) => {
          console.log("==========err-1=======", err);
        })
      }
    />
  );
};

export default function HomeScreen() {
  return (
    <LogtoProvider config={logtoConfig}>
      <View style={{ flex: 1, paddingTop: 100 }}>
        <Content />
      </View>
    </LogtoProvider>
  );
}
