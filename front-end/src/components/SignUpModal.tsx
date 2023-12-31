import * as authApi from "../network/AuthApi";

import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/AuthApi";
import { Alert, Button, Form, Modal } from "react-bootstrap";

import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { useState } from "react";
import { ConflictError } from "../errors/HttpError";

interface SignUpModalProps {
  onDismiss: () => void;
  onSignUpSuccessfull: (user: User) => void;
}

const SignUpModal = ({ onDismiss, onSignUpSuccessfull }: SignUpModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const newUser = await authApi.signUp(credentials);
      onSignUpSuccessfull(newUser);
    } catch (error) {
      if (error instanceof ConflictError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.error(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            register={register}
            registerOptions={{
              required: true,
            }}
            type="text"
            placeholder="username"
            error={errors.username}
          />
          <TextInputField
            name="email"
            label="Email"
            register={register}
            registerOptions={{
              required: true,
            }}
            type="email"
            placeholder="email"
            error={errors.email}
          />
          <TextInputField
            name="password"
            label="Password"
            register={register}
            registerOptions={{
              required: true,
            }}
            type="password"
            placeholder="password"
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`${styleUtils.btnCustom} w-100 align-items-center justify-content-center`}
          >
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;
