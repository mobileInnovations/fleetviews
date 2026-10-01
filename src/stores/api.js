import axios from "axios";
import { API_URL } from "@/config/env";

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
    const response = await axios.get(`${API_URL}/deviceCamera`, {
      SerialNo,
      Token,
    });
    return response.data;
  } catch (error) {
    console.error("Error querying device camera info:", error);
    throw error;
  }
};
