import axios from "axios";
import { API_URL, API_USERNAME, API_PASSWORD } from "@/config/env";

const authHeader = {
  auth: {
    username: API_USERNAME,
    password: API_PASSWORD,
  },
};

export const queryGtOfDevice = async (deviceNo) => {
  try {
    const response = await axios.post(`/vss/vehicle/queryGtOfDevice.action`, {
      deviceNo,
    });
    return response.data;
  } catch (error) {
    console.error("Error querying GT of device:", error);
    throw error;
  }
};

export const getDeviceCameraInfo = async (SerialNo, Token) => {
  try {
    const url = `${API_URL}/deviceCamera`;
    const headers = {
      headers: {
        SerialNo,
        Token,
      },
    };

    const response = await axios.get(url, { ...headers, ...authHeader });

    return response.data;
  } catch (error) {
    console.error("Error querying device camera info:", error);
    throw error;
  }
};

export const getVideoSystemById = async (videoSystemId) => {
  try {
    const url = `${API_URL}/videoSystem/${videoSystemId}`;
    const response = await axios.get(url, authHeader);
    return response.data;
  } catch (error) {
    console.error("Error querying video system info:", error);
    throw error;
  }
};

export const genNewTokenFromHero = async (username, password) => {
  try {
    const url = `/vss/user/apiLogin.action?username=${username}&password=${password}`;
    const { data } = await axios.get(url);

    console.log("genNewTokenFromHero response:", data);
    if (data.status === 10082) {
      return {
        success: false,
        message: "Login too frequently. Please try again later.",
      };
    } else if (data.status === 10000) {
      return { success: true, token: data.data.token };
    } else if (data.status !== 0) {
      return {
        success: false,
        message: `Login failed with status: ${data.status}, message: ${data.msg}`,
      };
    } else if (!data.data || !data.data.token) {
      return {
        success: false,
        message: "Login successful but no token received.",
      };
    } else {
      return {
        success: false,
        message: "Unknown error occurred during token generation.",
      };
    }
  } catch (error) {
    console.error("Failed to generate new token:", error);
    throw error;
  }
};

export const updateNewToken = async (videoSystemId, newToken) => {
  try {
    const url = `${API_URL}/videoSystem/${videoSystemId}`;
    const response = await axios.put(url, { ApiToken: newToken }, authHeader);
    return response.data;
  } catch (error) {
    console.error("Failed to update new token:", error);
    throw error;
  }
};
