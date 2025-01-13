import React, { useState } from "react";
import { Button } from "./ui/button";
import { FetchUser } from "utils/fetchUser";
import axios from "axios";

export default function ConnectForm() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const { user, loading, error: userError } = FetchUser();

  return (
    <div className="container">
      <div className="header">
        {!connectedAccountId && (
          <>
            <h2>Want to start selling on Agora?</h2>
          </>
        )}
        {connectedAccountId && (
          <>
            <h2>Add your information to start accepting money and selling your products</h2>
            <h2>This should only take around 5 minutes.</h2>
          </>
        )}
        {!accountCreatePending && !connectedAccountId && (
          <Button variant="bigpurple" onClick={async () => {
              setAccountCreatePending(true);
              setError(false);
              try {
                  const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/account`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ userId: user._id }),
                  });

                  if (response.status !== 200) {
                      throw new Error(response.data.error || 'Failed to create account');
                  }

                  const { account } = response.data;

                  if (account) {
                      setConnectedAccountId(account);
                      
                      // Update user's Stripe ID in the backend
                      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/update_user_stripe_id`, {
                          userId: user._id,
                          stripeId: account,
                      });
                  }
              } catch (error) {
                  console.error('Error creating account:', error);
                  setError(true);
              } finally {
                  setAccountCreatePending(false);
              }
          }}
          >
            Enter your details to start receiving payments.
          </Button>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <Button variant="bigpurple" onClick={async () => {
              setAccountLinkCreatePending(true);
              setError(false);
              axios.post(`${process.env.REACT_APP_API_BASE_URL}/account_link`, {
                account: connectedAccountId, // Directly pass the account ID
              })
                .then((response) => {
                  setAccountLinkCreatePending(false);

                  const { url, error } = response.data;
                  if (url) {
                    window.location.href = url;
                  }

                  if (error) {
                    setError(true);
                  }
                })
                .catch((error) => {
                  console.error('Error creating account link:', error);
                  setError(true); // Update your error state
                });
            }}
          >
            Add information
          </Button>
        )}
        {error && <p className="text-sm text-red-500">Something went wrong!</p>}
        {(connectedAccountId || accountCreatePending || accountLinkCreatePending) && (
          <div className="dev-callout">
            {/* {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>} */}
            {accountCreatePending && <p className="text-sm">Creating a connected account...</p>}
            {accountLinkCreatePending && <p className="text-sm">Creating a new Account Link...</p>}
          </div>
        )}
      </div>
    </div>
  );
}