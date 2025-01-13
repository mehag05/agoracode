import { useState, useEffect } from "react";
import { StripeConnectInstance, loadConnectAndInitialize } from "@stripe/connect-js";
import axios from 'axios';

export const useStripeConnect = (connectedAccountId: any) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | undefined>();

  useEffect(() => {
    if (connectedAccountId) {

      const fetchClientSecret = async () => {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/account_session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: connectedAccountId,
          }),
        });

        if (response.status !== 200) {
          // Handle errors on the client side here
          const { error } = response.data; // Use response.data for Axios
          throw ("An error occurred: " + error);
        } else {
          const { client_secret: clientSecret } = response.data;
          return clientSecret;
        }
      };

      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY! as string,
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#4b0082",
            },
          },
        })
      );
    }
  }, [connectedAccountId]);

  return stripeConnectInstance;
};

export default useStripeConnect;