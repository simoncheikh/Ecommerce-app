import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import { Textfield } from "./Textfield";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { control } = useForm({
    defaultValues: { email: "", password: "" },
  });

  return <>{React.cloneElement(children as React.ReactElement, { control })}</>;
};

describe("Textfield component", () => {
  it("renders with placeholder", () => {
    const { getByPlaceholderText } = render(
      <Wrapper>
        <Textfield name="email" placeholder="Enter email" type="default" />
      </Wrapper>
    );

    expect(getByPlaceholderText("Enter email")).toBeTruthy();
  });

  it("updates value when typed into", () => {
    const { getByPlaceholderText } = render(
      <Wrapper>
        <Textfield name="email" placeholder="Enter email" type="default" />
      </Wrapper>
    );

    const input = getByPlaceholderText("Enter email");
    fireEvent.changeText(input, "test@example.com");
    expect(input.props.value).toBe("test@example.com");
  });

  it("hides text when name is password", () => {
    const { getByPlaceholderText } = render(
      <Wrapper>
        <Textfield name="password" placeholder="Enter password" type="default" />
      </Wrapper>
    );

    const input = getByPlaceholderText("Enter password");
    expect(input.props.secureTextEntry).toBe(true);
  });
});
