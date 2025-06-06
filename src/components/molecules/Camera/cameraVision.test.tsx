import React from "react";
import { View } from "react-native"; // You forgot this import!
import { render, fireEvent } from "@testing-library/react-native";
import { CameraVision } from "./CameraVision"; // Adjust the import path
import { useCameraDevice, useCameraPermission } from "react-native-vision-camera";

const MockCamera = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    takePhoto: jest.fn(() => Promise.resolve({ path: "/mock/photo.jpg" })),
  }));
  return <View testID="mock-camera" />;
});

const frontDeviceMock = { position: "front" };
const backDeviceMock = { position: "back" };

jest.mock("react-native-vision-camera", () => ({
  useCameraDevice: jest.fn((position) => {
    if (position === "front") return frontDeviceMock;
    if (position === "back") return backDeviceMock;
    return null;
  }),
  useCameraPermission: jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(),
  })),
  Camera: MockCamera,
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

  it("calls onPhotoTaken when the capture button is pressed", async () => {
    const onClose = jest.fn();
    const onPhotoTaken = jest.fn();

    const { getByTestId } = render(
      <CameraVision onClose={onClose} onPhotoTaken={onPhotoTaken} visible={true} />
    );

    const button = getByTestId("capture-button");
    fireEvent.press(button);

    await new Promise((res) => setTimeout(res, 0));

    expect(onClose).toHaveBeenCalled();
    expect(onPhotoTaken).toHaveBeenCalledWith(expect.stringContaining("/mock/photo.jpg"));
  });
});
