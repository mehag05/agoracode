import axios from "axios";
import { getApiDomain } from "../config/config";
import React from "react";

export default function CallAPIView() {
    async function callAPIClicked() {
        const response = await axios.get(getApiDomain() + "/sessioninfo");
        window.alert("Session Information:\n" + JSON.stringify(response.data, null, 2));
    }

    return (
        <div onClick={callAPIClicked} className="sessionButton">
            Call API
        </div>
    );
}
