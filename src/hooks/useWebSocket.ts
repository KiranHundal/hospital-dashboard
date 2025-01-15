import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "./redux";
import { WebSocketMessage } from "../types/patient";
import { CONFIG } from "../config/constants";
import { setConnected, setError } from "../store/slices/websocketSlice";
import {
  updatePatient,
  clearUpdateHighlight,
} from "../store/slices/patientSlice";
import { QUERY_KEYS } from "./queries";

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      try {
        dispatch(
          updatePatient({
            patientId: message.patientId,
            vitals: message.vitals,
            isUpdated: true,
          })
        );

        queryClient.setQueryData(QUERY_KEYS.patients, (oldData: any) => {
          if (!Array.isArray(oldData)) return oldData;
          const updatedPatients = oldData.map((patient) =>
            patient.id === message.patientId
              ? {
                  ...patient,
                  vitals: { ...patient.vitals, ...message.vitals },
                  isUpdated: true,
                }
              : patient
          );
          console.log("Saving patients to localStorage:", updatedPatients);

          localStorage.setItem("patients", JSON.stringify(updatedPatients));

          return updatedPatients;
        });

        queryClient.setQueryData(
          QUERY_KEYS.patient(message.patientId),
          (oldData: any) => {
            if (!oldData) return oldData;
            const updatedPatient = {
              ...oldData,
              vitals: { ...oldData.vitals, ...message.vitals },
              isUpdated: true,
            };

            localStorage.setItem(
              `patient-${message.patientId}`,
              JSON.stringify(updatedPatient)
            );

            return updatedPatient;
          }
        );

        setTimeout(() => {
          dispatch(clearUpdateHighlight());

          queryClient.setQueryData(QUERY_KEYS.patients, (oldData: any) => {
            if (!Array.isArray(oldData)) return oldData;
            const clearedPatients = oldData.map((patient) =>
              patient.id === message.patientId
                ? { ...patient, isUpdated: false }
                : patient
            );

            localStorage.setItem("patients", JSON.stringify(clearedPatients));

            return clearedPatients;
          });
        }, 2000);
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
        dispatch(setError("Error processing update"));
      }
    },
    [dispatch, queryClient]
  );


  const connect = useCallback(() => {
    const ws = new WebSocket(CONFIG.WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("WebSocket Connected");
      dispatch(setConnected(true));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (isValidWebSocketMessage(message)) {
          handleWebSocketMessage(message);
        } else {
          console.warn("Invalid message format:", message);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
        dispatch(setError("Error processing update"));
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      dispatch(setConnected(false));
      setTimeout(connect, 3000);
    };

    ws.onerror = (event) => {
      console.error("WebSocket Error:", event);
      dispatch(setError("WebSocket connection error"));
    };

    return ws;
  }, [dispatch, handleWebSocketMessage]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.close();
    };
  }, [connect]);
};

function isValidWebSocketMessage(
  message: unknown
): message is WebSocketMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "patientId" in message &&
    "vitals" in message &&
    typeof (message as WebSocketMessage).patientId === "string" &&
    typeof (message as WebSocketMessage).vitals === "object"
  );
}
