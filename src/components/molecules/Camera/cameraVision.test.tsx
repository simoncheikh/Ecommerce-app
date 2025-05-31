import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CameraVision } from "./CameraVision"; // Adjust the import path
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

// Mock camera hooks
jest.mock("react-native-vision-camera", () => ({
    Camera: jest.fn(),
    useCameraDevice: jest.fn(() => ({ position: "front" })),
    useCameraPermission: jest.fn(() => ({
        hasPermission: true,
        requestPermission: jest.fn(),
    })),
}));

describe("CameraVision Component", () => {
    it("renders correctly when visible", () => {
        const onClose = jest.fn();
        const onPhotoTaken = jest.fn();

        const { getByTestId } = render(
            <CameraVision onClose={onClose} onPhotoTaken={onPhotoTaken} visible={true} />
        );

        expect(getByTestId("mock-camera")).toBeTruthy();
    });

    it("renders permission warning when camera permission is denied", () => {
        (useCameraPermission as jest.Mock).mockReturnValue({
            hasPermission: false,
            requestPermission: jest.fn(),
        });

        const { getByText } = render(
            <CameraVision onClose={jest.fn()} onPhotoTaken={jest.fn()} visible={true} />
        );

        expect(getByText("Camera permission not granted.")).toBeTruthy();
    });

    it("calls onPhotoTaken when the capture button is pressed", () => {
        const onClose = jest.fn();
        const onPhotoTaken = jest.fn();

        const { getByRole } = render(
            <CameraVision onClose={onClose} onPhotoTaken={onPhotoTaken} visible={true} />
        );

        const button = getByRole("button");
        fireEvent.press(button);

        expect(onClose).toHaveBeenCalled();
    });
});
